// server-express.mjs
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'victonnel-ai-backend' 
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;
    
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: message });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
    });
    
    res.json({
      response: completion.choices[0].message.content,
      usage: completion.usage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    name: 'VICTONNEL AI Backend',
    version: '1.0.0',
    endpoints: ['/health', '/api/chat']
  });
});

app.listen(port, () => {
  console.log(`🚀 VICTONNEL AI Backend running on port ${port}`);
});
