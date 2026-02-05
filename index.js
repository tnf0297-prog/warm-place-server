const express = require("express");
const cors = require("cors");

const app = express();

/**
 * 🔴 CORS 完全対応（ここ重要）
 */
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ← ★これが不足していました

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Warm Place Server OK");
});

app.post("/chat", async (req, res) => {
  try {
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
