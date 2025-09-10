


import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Image, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  ScrollView,
  Dimensions,
  StatusBar
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Use your machine's IP address instead of localhost for physical device testing
const API_BASE = "http://172.27.224.1:4000/api/v1/requests/create";

export default function RequestFormScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick image
  const pickImage = async () => {
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
      base64: Platform.OS === 'web',
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f0f23']}
        style={styles.backgroundGradient}
      />
      
      {/* Floating Background Elements */}
      <View style={styles.floatingElement1} />
      <View style={styles.floatingElement2} />
      <View style={styles.floatingElement3} />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>⚡</Text>
          </LinearGradient>
          
          <Text style={styles.mainTitle}>EDUZAP</Text>
          <Text style={styles.subtitle}>Request Anything, We Deliver in</Text>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timeContainer}
          >
            <Text style={styles.timeText}>2 Hours</Text>
          </LinearGradient>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <BlurView intensity={20} tint="dark" style={styles.formCard}>
            
            {/* Name Input */}
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

            {/* Phone Input */}
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

            {/* Title Input */}
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

            {/* Image Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Attach Image (Optional)</Text>
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <LinearGradient
                  colors={image ? ['#10B981', '#059669'] : ['#6366F1', '#8B5CF6']}
                  style={styles.uploadGradient}
                >
                  <Text style={styles.uploadIcon}>
                    {image ? '✓' : '📷'}
                  </Text>
                  <Text style={styles.uploadText}>
                    {image ? "Image Selected" : "Choose Image"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Image Preview */}
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

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleSubmit} 
              disabled={loading}
              style={styles.submitContainer}
            >
              <LinearGradient
                colors={loading ? ['#666', '#444'] : ['#8B5CF6', '#EC4899']}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>
                  {loading ? "Submitting..." : "Submit Request 🚀"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Powered by AI • Fast • Reliable • Secure
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingElement1: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.1,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    transform: [{ scale: 1.2 }],
  },
  floatingElement2: {
    position: 'absolute',
    top: height * 0.6,
    right: width * 0.1,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
  },
  floatingElement3: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.7,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 30,
    color: '#fff',
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  timeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 50,
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  uploadIcon: {
    fontSize: 24,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 40,
  },
});