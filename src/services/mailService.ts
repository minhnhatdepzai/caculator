import { Platform } from "react-native";

// Địa chỉ backend
// - Android emulator: dùng 10.0.2.2 để trỏ về máy host
// - iOS simulator: localhost thường OK
// - Web: localhost OK
const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8787"
    : "http://localhost:8787";

export async function sendResultEmail(params: {
  expression: string;
  result: string;
  mode: "AI" | "STANDARD";
}) {
  try {
    const res = await fetch(`${BASE_URL}/send-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expression: params.expression,
        result: params.result,
        mode: params.mode,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${t}`);
    }
    return true;
  } catch (e) {
    console.error("sendResultEmail error:", e);
    return false;
  }
}
