const express = require("express");
const cors = require("cors");

const app = express();

/**
 * 🌍 CORS（最重要）
 */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// 🔴 OPTIONS 明示対応（これが無いとスマホが死ぬ）
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Warm Place Server OK");
});

app.post("/chat", (req, res) => {
  try {
    const messages = req.body.messages || [];

    res.json({
      reply: "こんにちは。ちゃんと届いています 🌱",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
