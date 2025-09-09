import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

// Use your machine's IP address instead of localhost for physical device testing
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
const API_BASE = "http://172.27.224.1:4000/api/v1/requests"; // Your computer's IP address
// Alternative: "http://localhost:4000/api/v1/requests" for emulator
// For Android emulator: "http://10.0.2.2:4000/api/v1/requests"
// Ensure same WiFi for physical devices; check firewall/port 4000 open

export default function RequestFormScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick image
  const pickImage = async () => {
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: Platform.OS === 'web', // Get base64 for web to convert to blob
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Helper for web: dataURL to Blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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
      let imageData: any;
      if (Platform.OS === 'web') {
        // On web, uri is data URL; convert to File
        const blob = dataURLtoBlob(image);
        imageData = new File([blob], "upload.jpg", { type: "image/jpeg" });
      } else {
        imageData = {
          uri: image,
          name: "upload.jpg",
          type: "image/jpeg",
        };
      }
      formData.append("image", imageData);
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