import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// JSONを受け取れるように
app.use(express.json());

// CORS（Flutter Web 対応）
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Warm Place Server OK 🌱");
});

app.post("/chat", async (req, res) => {
  try {
    const { mode, messages } = req.body;
    console.log("📩 受信:", req.body);

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "サーバーに API キーが設定されていません。",
      });
    }

    // モード別システムプロンプト
    const systemPrompt =
      mode === "寄合"
        ? `
あなたは穏やかな集会の司会役です。
複数人の意見をまとめ、安心感のある日本語で返答してください。
結論を急がず、場の空気を大切にしてください。
`
        : `
あなたは井戸端で話を聞いてくれる、やさしい相手です。
共感を大切にし、短めで温かい日本語で返答してください。
アドバイスは控えめにしてください。
`;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await openaiResponse.json();

    const reply =
      data?.choices?.[0]?.message?.content ??
      "……（少し考えています）";

    res.json({ reply });
  } catch (error) {
    console.error("❌ OpenAI error:", error);
    res.status(500).json({
      reply: "通信の途中で、少しつまずいてしまいました。",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});

