import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Warm Place Server with OpenAI OK 🌱");
});

app.post("/chat", async (req, res) => {
  try {
    const { mode, messages } = req.body;
    console.log("📩 受信:", { mode, messages });

    const systemPrompt =
      mode === "寄合"
        ? "あなたは複数人の会話をやさしくまとめる聞き役です。"
        : "あなたは井戸端会議でそっと相槌を打つ、やさしい聞き役です。";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ??
      "……少し考えています 🌱";

    res.json({ reply });

  } catch (err) {
    console.error("❌ サーバー例外:", err);
    res.status(500).json({ reply: "少しお休み中です 🌿" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌱 Server listening on port ${PORT}`);
});
