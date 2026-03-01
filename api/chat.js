import OpenAI from "openai";

export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Ensure body exists (Vercel sometimes sends string body)
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    if (!body?.message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ✅ Create OpenAI client INSIDE handler (important for Vercel)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: body.message },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: error.message || "AI request failed",
    });
  }
}
