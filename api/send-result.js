import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { expression, result, mode } = req.body || {};
    if (!result) return res.status(400).json({ ok: false, error: "Missing result" });

    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const TO_EMAIL = process.env.TO_EMAIL;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !TO_EMAIL) {
      return res.status(500).json({ ok: false, error: "Missing env vars" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
    });

    await transporter.sendMail({
      from: `"Lumina Calc" <${GMAIL_USER}>`,
      to: TO_EMAIL,
      subject: `[Lumina Calc] ${mode === "AI" ? "AI Result" : "Result"}`,
      text:
        `Lumina Calc - ${mode === "AI" ? "AI MODE" : "STANDARD MODE"}\n` +
        `Expression: ${expression ?? ""}\n` +
        `Result: ${result}\n` +
        `Time: ${new Date().toISOString()}\n`,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Send failed" });
  }
}
