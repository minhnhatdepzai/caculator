import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { X, Eraser } from "lucide-react-native";

export default function HistoryDrawer({
  visible,
  onClose,
  history,
  onClear,
}: {
  visible: boolean;
  onClose: () => void;
  history: string[];
  onClear: () => void;
}) {
  const x = useRef(new Animated.Value(1)).current; // 1 offscreen, 0 onscreen

  useEffect(() => {
    Animated.spring(x, { toValue: visible ? 0 : 1, useNativeDriver: true, damping: 20, stiffness: 180 }).start();
  }, [visible, x]);

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [0, 420] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Lịch sử</Text>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <X color="white" size={20} />
          </Pressable>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 16 }}>
          {history.length === 0 ? (
            <Text style={styles.empty}>Chưa có lịch sử tính toán.</Text>
          ) : (
            history.map((item, i) => (
              <View key={`${item}-${i}`} style={styles.item}>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <Pressable style={styles.clearBtn} onPress={onClear}>
          <Eraser color="rgba(252,165,165,0.95)" size={18} />
          <Text style={styles.clearText}>Xóa lịch sử</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  drawer: {
    position: "absolute",
    top: 16,
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 40,
    padding: 18,
    backgroundColor: "rgba(17,24,39,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { color: "white", fontSize: 22, fontWeight: "800" },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  scroll: { flex: 1 },
  empty: { color: "rgba(255,255,255,0.30)", textAlign: "center", marginTop: 40 },
  item: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  itemText: { color: "white", fontSize: 18, fontWeight: "600", textAlign: "right" },
  clearBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(239,68,68,0.22)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  clearText: { color: "rgba(252,165,165,0.95)", fontSize: 16, fontWeight: "700" },
});
