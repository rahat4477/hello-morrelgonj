import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Hello Morrelganj (হ্যালো মোড়েলগঞ্জ)',
    timestamp: new Date().toISOString()
  });
});

// Gemini AI Assistant Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, userRole } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Valid prompt is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.json({
        text: 'হ্যালো! বর্তমানে Gemini API Key সেট করা নেই। আপনার তথ্যের জন্য: মোড়েলগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স ফোন: 01713-241250, মোড়েলগঞ্জ থানা: 01713-374150, এবং জরুরি ৯৯৯ হেল্পলাইনে সরাসরি কল করতে পারেন।'
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `
You are the official friendly AI assistant for "Hello Morrelganj" (হ্যালো মোড়েলগঞ্জ), an official web portal and mobile app for Morrelganj Upazila, Bagerhat District, Khulna Division, Bangladesh.
Respond politely and clearly in Bengali (বাংলা) unless asked otherwise in English.

Key Info about Morrelganj:
- Location: Bagerhat district, Khulna division, Bangladesh. Situated on the banks of Panguchi River. Gateway to Sundarbans.
- Upazila Health Complex: Hospital Road, Morrelganj (50 beds). Phone: 01713-241250.
- Police Station (মোড়েলগঞ্জ থানা): 01713-374150.
- Emergency Helpline: 999. Fire Service: 01713-991100.
- Key Tourist Spots: Panguchi Riverview Embankment & Walkway, Upazila Parishad Park & Lake, Historical Morrel Kuthi site, Chingrakhali Mangrove gateway.
- You can help users with blood donor guidance, doctor appointments, emergency ambulance search, tourist guide numbers, and government office contacts in Morrelganj.

Provide concise, helpful, and accurate answers with bullet points and phone numbers when appropriate.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি। পুনরায় চেষ্টা করুন।';
    res.json({ text });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.status(500).json({
      error: 'AI সার্ভিস সাময়িক অকার্যকর',
      details: error?.message || 'Server error'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hello Morrelganj Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
