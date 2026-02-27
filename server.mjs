import { createServer } from 'node:http';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = createServer(async (req, res) => {

  // Enable CORS (important for frontend connection)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/chat") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { message } = JSON.parse(body);

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
        });

        const reply = completion.choices[0].message.content;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply }));

      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Something went wrong" }));
      }
    });

  } else {
    res.writeHead(404);
    res.end("Not Found");
  }

});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
