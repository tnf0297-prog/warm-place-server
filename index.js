const express = require("express");
const cors = require("cors");

const app = express();

/**
 * 🔴 Cloud Run / Flutter Web 対応
 */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Warm Place Server OK");
});

app.post("/chat", async (req, res) => {
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

/**
 * 🔴 ここが最重要ポイント
 */
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on ${port}`);
});
