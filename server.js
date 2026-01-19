import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "200kb" }));

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Send mail
app.post("/send-result", async (req, res) => {
  try {
    const { expression, result, mode } = req.body || {};
    if (!result) return res.status(400).json({ ok: false, error: "Missing result" });

    const { GMAIL_USER, GMAIL_APP_PASSWORD, TO_EMAIL } = process.env;
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !TO_EMAIL) {
      return res.status(500).json({ ok: false, error: "Missing env vars" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
      from: `"Lumina Calc" <${GMAIL_USER}>`,
      to: TO_EMAIL,
      subject: `[Lumina Calc] ${mode === "AI" ? "AI Result" : "Result"}`,
      text:
        `Expression: ${expression ?? ""}\n` +
        `Result: ${result}\n` +
        `Mode: ${mode}\n` +
        `Time: ${new Date().toISOString()}\n`,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Send failed" });
  }
});

// Serve built web (dist)
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback (expo-router)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => console.log("Server running on", port));
