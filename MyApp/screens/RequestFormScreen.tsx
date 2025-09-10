import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView, // Added SafeAreaView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

// Use your machine's IP address instead of localhost for physical device testing
const API_BASE = "http://172.27.224.1:4000/api/v1/requests/create";

export default function RequestFormScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick image (unchanged)
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: Platform.OS === "web",
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Helper for web: dataURL to Blob (unchanged)
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Submit form (unchanged)
  const handleSubmit = async () => {
    if (!name || !phone || !title) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }
    const phoneRegex = /^(?:\+91[0-9]{10}|[0-9]{10})$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Validation Error", "Phone number must be 10 digits (e.g., 9876543210) or +91 followed by 10 digits (e.g., +919876543210)");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("title", title);
    if (image) {
      let imageData: any;
      if (Platform.OS === "web") {
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f0f23"]}
        style={styles.backgroundGradient}
      />
      <View style={styles.floatingElement1} />
      <View style={styles.floatingElement2} />
      <View style={styles.floatingElement3} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true} // Changed to true for better UX
      >
        <View style={styles.header}>
          <LinearGradient
            colors={["#8B5CF6", "#EC4899", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>⚡</Text>
          </LinearGradient>
          <Text style={styles.mainTitle}>EDUZAP</Text>
          <Text style={styles.subtitle}>Request Anything, We Deliver in</Text>
          <LinearGradient
            colors={["#8B5CF6", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timeContainer}
          >
            <Text style={styles.timeText}>2 Hours</Text>
          </LinearGradient>
        </View>
        <View style={styles.formContainer}>
          <BlurView intensity={20} tint="dark" style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Request Title</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="What do you need?"
                  placeholderTextColor="#666"
                  value={title}
                  onChangeText={setTitle}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Attach Image (Optional)</Text>
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <LinearGradient
                  colors={image ? ["#10B981", "#059669"] : ["#6366F1", "#8B5CF6"]}
                  style={styles.uploadGradient}
                >
                  <Text style={styles.uploadIcon}>{image ? "✓" : "📷"}</Text>
                  <Text style={styles.uploadText}>
                    {image ? "Image Selected" : "Choose Image"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {image && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: image }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setImage(null)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitContainer}
            >
              <LinearGradient
                colors={loading ? ["#666", "#444"] : ["#8B5CF6", "#EC4899"]}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>
                  {loading ? "Submitting..." : "Submit Request 🚀"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
        <Text style={styles.footer}>Powered by AI • Fast • Reliable • Secure</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingElement1: {
    position: "absolute",
    top: height * 0.05, // Reduced to fit Pixel 5
    left: width * 0.1,
    width: 120, // Scaled down for smaller screen
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    transform: [{ scale: 1.1 }],
  },
  floatingElement2: {
    position: "absolute",
    top: height * 0.65, // Adjusted for taller screen
    right: width * 0.1,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(236, 72, 153, 0.1)",
  },
  floatingElement3: {
    position: "absolute",
    top: height * 0.25,
    left: width * 0.65,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20, // Reduced from 60 to account for SafeAreaView
    paddingHorizontal: 15, // Slightly reduced for Pixel 5
    paddingBottom: 40, // Added to ensure footer is visible
  },
  header: {
    alignItems: "center",
    marginBottom: 30, // Reduced to save vertical space
  },
  logoContainer: {
    width: 50, // Scaled down for Pixel 5
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24, // Reduced for smaller screen
    color: "#fff",
  },
  mainTitle: {
    fontSize: 32, // Slightly reduced
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16, // Slightly reduced
    color: "#A0A0A0",
    marginBottom: 6,
  },
  timeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeText: {
    fontSize: 18, // Slightly reduced
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    marginBottom: 20, // Reduced to save space
  },
  formCard: {
    borderRadius: 16,
    padding: 20, // Slightly reduced
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  inputContainer: {
    marginBottom: 20, // Slightly reduced
  },
  inputLabel: {
    fontSize: 14, // Adjusted for Pixel 5
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 6,
  },
  inputWrapper: {
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  input: {
    padding: 12, // Reduced padding
    fontSize: 14, // Adjusted for Pixel 5
    color: "#fff",
    minHeight: 44, // Reduced for compact layout
  },
  uploadButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  uploadGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12, // Reduced padding
    gap: 10,
  },
  uploadIcon: {
    fontSize: 20, // Reduced
  },
  uploadText: {
    fontSize: 14, // Reduced
    fontWeight: "600",
    color: "#fff",
  },
  previewContainer: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: 160, // Reduced for Pixel 5
    borderRadius: 10,
  },
  removeImageBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
  },
  submitButton: {
    paddingVertical: 14, // Reduced
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontSize: 16, // Reduced
    fontWeight: "bold",
    color: "#fff",
  },
  footer: {
    textAlign: "center",
    color: "#666",
    fontSize: 12, // Reduced
    marginBottom: 30, // Adjusted
  },
});