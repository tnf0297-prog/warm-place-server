import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());

// CORS（Flutter Web 対応）
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_, res) => {
  res.send("Warm Place Server with OpenAI 🌱");
});

app.post("/chat", async (req, res) => {
  try {
    const { mode, messages } = req.body;

    console.log("📩 受信:", req.body);

    const systemPrompt =
      mode === "寄合"
        ? "あなたは複数人の会話をやさしくまとめる聞き役です。全員が安心して話せるようにしてください。"
        : "あなたは井戸端会議でそっと相槌を打つ、やさしい聞き役です。短めで温かい返答をしてください。";

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
          ...messages,
        ],
        temperature: 0.8,
      }),
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ??
      "……うまく言葉が見つかりませんでした 🌱";

    res.json({ reply });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({
      reply: "少しお休み中です。あとでもう一度話しかけてください 🌿",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});


