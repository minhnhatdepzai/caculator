import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function FloatingOrb({
  size,
  color,
  initial,
  drift,
  duration = 20000,
  delay = 0,
  opacity = 0.55,
}: {
  size: number;
  color: string;
  initial: { top?: number | string; left?: number | string; right?: number | string; bottom?: number | string };
  drift: { x: number; y: number; scale: number };
  duration?: number;
  delay?: number;
  opacity?: number;
}) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [t, duration, delay]);

  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, drift.x] });
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, drift.y] });
  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, drift.scale] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
          ...initial,
        },
      ]}
    />
  );
}

export default function AuroraBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={["#1e1b4b", "#000000"]} style={StyleSheet.absoluteFill} />

      <FloatingOrb
        size={420}
        color="#4f46e5"
        initial={{ top: -120, left: -120 }}
        drift={{ x: 30, y: -50, scale: 1.1 }}
      />
      <FloatingOrb
        size={520}
        color="#ec4899"
        initial={{ bottom: -180, right: -180 }}
        drift={{ x: -30, y: 40, scale: 0.9 }}
        delay={2500}
      />
      <FloatingOrb
        size={320}
        color="#06b6d4"
        initial={{ top: "42%", left: "38%" }}
        drift={{ x: -20, y: 20, scale: 1.05 }}
        delay={5000}
        opacity={0.5}
      />

      <View style={styles.vignette} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: { position: "absolute" },
  vignette: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15,23,42,0.25)" },
});
