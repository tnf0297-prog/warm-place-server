import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// ★ ここが超重要
app.use(cors());

// JSONを受け取れるようにする
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Warm Place Server OK");
});

app.post("/chat", (req, res) => {
  console.log("📩 受信:", req.body);

  res.json({
    reply: "こんにちは、サーバーです 🌱",
    received: req.body
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
