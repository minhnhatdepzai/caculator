import type { AIResponse } from "../types";

/**
 * Dùng Gemini REST generateContent.
 * - responseMimeType + responseSchema để ép JSON output.
 * (Nếu model bạn chọn không hỗ trợ schema, mình có fallback parse JSON trong text.)
 */
const MODEL = "gemini-3-flash-preview"; // đổi nếu bạn muốn

function getApiKey() {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");
  return key;
}

export async function solveMathWithAI(query: string): Promise<AIResponse> {
  try {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const prompt = `Bạn là một trợ lý toán học thông minh. Hãy giải quyết vấn đề toán học sau đây: "${query}".
Hãy trả về kết quả dưới dạng JSON với 2 trường:
1. "answer": Kết quả ngắn gọn (số hoặc phương trình).
2. "explanation": Giải thích ngắn gọn cách làm bằng tiếng Việt (dưới 50 từ).`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            answer: { type: "STRING" },
            explanation: { type: "STRING" },
          },
          required: ["answer", "explanation"],
        },
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Gemini HTTP ${res.status}: ${t}`);
    }

    const json: any = await res.json();

    // candidates[0].content.parts[].text
    const text: string =
      json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join("") ?? "";

    if (!text) throw new Error("Empty AI response text");

    // Vì responseMimeType=application/json nên text sẽ là JSON string
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback: nếu model không tuân schema, cố tìm JSON trong chuỗi
      const maybe = text.match(/\{[\s\S]*\}/)?.[0];
      if (!maybe) throw new Error("Cannot parse JSON");
      parsed = JSON.parse(maybe);
    }

    return {
      answer: String(parsed.answer ?? "Lỗi"),
      explanation: String(parsed.explanation ?? "Không có giải thích."),
    };
  } catch (e) {
    console.error("Gemini Error:", e);
    return { answer: "Lỗi", explanation: "Không thể kết nối với AI. Vui lòng thử lại." };
  }
}
