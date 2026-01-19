import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Calculator from "./components/Calculator";
import AuroraBackground from "./components/AuroraBackground";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AuroraBackground />

        <View style={styles.content}>
          <Calculator />

          <View style={styles.footer}>
            <Text style={styles.footerText}>DESIGNED FOR PERFORMANCE & BEAUTY</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    justifyContent: "center",
  },
  footer: { marginTop: 24, alignItems: "center", paddingBottom: 16 },
  footerText: {
    color: "rgba(255,255,255,0.18)",
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: "300",
  },
});
