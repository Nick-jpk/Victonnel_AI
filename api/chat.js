import OpenAI from "openai";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get message from request
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed to gpt-3.5-turbo (more stable)
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
    });

    // Get the reply
    const reply = completion.choices[0]?.message?.content || "No response";
    
    // Return success
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error("API Error:", error);
    
    // Return more detailed error
    return res.status(500).json({ 
      error: "AI request failed",
      details: error.message 
    });
  }
}
