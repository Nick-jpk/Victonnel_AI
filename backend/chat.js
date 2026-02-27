import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      });
      const reply = completion.data.choices[0].message.content;
      res.status(200).json({ reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ reply: "Error connecting to OpenAI API." });
    }
  } else {
    res.status(405).json({ reply: "Method not allowed" });
  }
}
