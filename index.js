import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Warm Place Server OK');
});

app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not set' });
    }

    const response = await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
  model: 'gpt-4.1-mini',
  input: messages.map(m => ({
    role: m.role,
    content: [
      { type: 'input_text', text: m.content }
    ]
  }))
}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: 'OpenAI API error', detail: data });
    }

    // ★ 正しい取り方
    const reply =
      data.output_text ??
      data.output?.[0]?.content?.[0]?.text ??
      '（AIからの返答を取得できませんでした）';

    res.json({ reply });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'server error',
      detail: String(e),
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
