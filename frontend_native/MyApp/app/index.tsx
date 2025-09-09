import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import RequestFormScreen from "../screens/RequestFormScreen";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <RequestFormScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
