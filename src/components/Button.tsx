import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import type { ButtonVariant } from "../types";

export default function Button({
  label,
  onClick,
  variant = "default",
  colSpan = 1,
  disabled,
}: {
  label: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  colSpan?: number;
  disabled?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.timing(scale, { toValue: 0.96, duration: 90, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();

  const variantStyle = getVariantStyle(variant);

  return (
    <View style={[styles.cell, { width: `${(colSpan / 4) * 100}%` }]}>
      <Pressable
        onPress={onClick}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          variantStyle.base,
          pressed && !disabled ? variantStyle.pressed : null,
          disabled ? styles.disabled : null,
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {typeof label === "string" ? <Text style={[styles.label, variantStyle.text]}>{label}</Text> : label}
        </Animated.View>

        <View pointerEvents="none" style={styles.gloss} />
      </Pressable>
    </View>
  );
}

function getVariantStyle(v: ButtonVariant) {
  switch (v) {
    case "action":
      return {
        base: { backgroundColor: "rgba(99,102,241,0.95)", borderColor: "rgba(99,102,241,0.35)" },
        pressed: { opacity: 0.92 },
        text: { color: "white" },
      };
    case "operator":
      return {
        base: { backgroundColor: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.10)" },
        pressed: { backgroundColor: "rgba(255,255,255,0.18)" },
        text: { color: "rgba(103,232,249,0.95)" },
      };
    case "function":
      return {
        base: { backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.06)" },
        pressed: { backgroundColor: "rgba(255,255,255,0.12)" },
        text: { color: "rgba(156,163,175,0.95)" },
      };
    case "danger":
      return {
        base: { backgroundColor: "rgba(239,68,68,0.22)", borderColor: "rgba(239,68,68,0.22)" },
        pressed: { backgroundColor: "rgba(239,68,68,0.30)" },
        text: { color: "rgba(248,113,113,0.95)" },
      };
    default:
      return {
        base: { backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.10)" },
        pressed: { backgroundColor: "rgba(255,255,255,0.10)" },
        text: { color: "rgba(255,255,255,0.95)" },
      };
  }
}

const styles = StyleSheet.create({
  cell: { padding: 6 },
  pressable: {
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  label: { fontSize: 22, fontWeight: "700" },
  gloss: { position: "absolute", top: 0, left: 0, right: 0, height: 26, backgroundColor: "rgba(255,255,255,0.08)" },
  disabled: { opacity: 0.6 },
});
