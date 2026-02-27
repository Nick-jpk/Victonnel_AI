import OpenAI from "openai";

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { message } = req.body;

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    const reply = response.output[0].content[0].text;
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
