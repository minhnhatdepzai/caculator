import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Display({
  input,
  result,
  aiExplanation,
  isAiMode,
}: {
  input: string;
  result: string;
  aiExplanation?: string;
  isAiMode: boolean;
}) {
  const mainText = result ? result : input || "0";
  const big = (mainText?.length ?? 0) > 12;

  return (
    <View style={styles.wrap}>
      <View style={styles.statusRow}>
        {isAiMode ? (
          <View style={styles.aiPill}>
            <View style={styles.dot} />
            <Text style={styles.aiPillText}>AI GEMINI</Text>
          </View>
        ) : (
          <Text style={styles.stdText}>STANDARD MODE</Text>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.prev} numberOfLines={1}>
          {result && !aiExplanation ? input : ""}
        </Text>

        <Text style={[styles.main, big ? styles.mainSmall : null]}>{mainText}</Text>
      </View>

      {!!aiExplanation && (
        <View style={styles.explain}>
          <Text style={styles.explainText}>"{aiExplanation}"</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    height: 190,
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
    backgroundColor: "rgba(0,0,0,0.20)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  statusRow: { position: "absolute", top: 14, left: 14, flexDirection: "row", alignItems: "center" },
  stdText: { color: "rgba(255,255,255,0.20)", fontSize: 12, fontWeight: "600" },
  aiPill: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(168,85,247,0.22)",
    borderWidth: 1,
    borderColor: "rgba(236,72,153,0.18)",
  },
  aiPillText: { color: "white", fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "white", opacity: 0.9 },

  body: { flex: 1, justifyContent: "flex-end", alignItems: "flex-end" },
  prev: { color: "rgba(156,163,175,0.70)", fontSize: 16, marginBottom: 6 },
  main: { color: "white", fontSize: 54, fontWeight: "800", textAlign: "right" },
  mainSmall: { fontSize: 38 },

  explain: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.10)" },
  explainText: { color: "rgba(103,232,249,0.95)", fontSize: 14, fontStyle: "italic", fontWeight: "300", textAlign: "right" },
});
