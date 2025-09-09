import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

// Use your machine's IP address instead of localhost for physical device testing
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
const API_BASE = "http://172.27.224.1:4000/api/v1/requests"; // Your computer's IP address
// Alternative: "http://localhost:4000/api/v1/requests" for emulator

export default function RequestFormScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick image
  const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: [ImagePicker.MediaType.image],
    allowsEditing: true,
    quality: 0.7,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setImage(result.assets[0].uri); // ✅ use assets[0].uri
  }
};


  // Submit form
  const handleSubmit = async () => {
    if (!name || !phone || !title) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("title", title);

    if (image) {
      formData.append("image", {
        uri: image,
        name: "upload.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let fetch set it automatically for FormData
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Request submitted successfully!");
        setName("");
        setPhone("");
        setTitle("");
        setImage(null);
      } else {
        Alert.alert("Error", data.error || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Request Anything, We Deliver in 2 Hours</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Request Title"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
        <Text style={styles.uploadText}>{image ? "Change Image" : "Pick Image"}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <Button title={loading ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: 16,
  },
  uploadBtn: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
});
