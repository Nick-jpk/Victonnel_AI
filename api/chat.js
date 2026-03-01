// api/chat.js
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
    // Parse body if it's a string
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    
    // Check for message
    if (!body?.message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      return res.status(500).json({ 
        error: "OpenAI API key not configured",
        details: "Please add OPENAI_API_KEY to your Vercel environment variables"
      });
    }

    // Dynamic import to avoid module resolution issues
    const { default: OpenAI } = await import('openai');
    
    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using gpt-3.5-turbo which is more widely available
      messages: [{ role: "user", content: body.message }],
      max_tokens: 150,
    });

    // Get the reply
    const reply = completion.choices[0]?.message?.content || "No response";
    
    // Return success
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error("API Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return user-friendly error
    return res.status(500).json({ 
      error: "AI request failed",
      details: error.message 
    });
  }
}
