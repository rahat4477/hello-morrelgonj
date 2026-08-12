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

// Verify Facebook Page Access Token & Page ID
app.post('/api/facebook/verify', async (req, res) => {
  try {
    const pageId = req.body.pageId || process.env.FACEBOOK_PAGE_ID;
    const pageAccessToken = req.body.pageAccessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !pageAccessToken) {
      res.status(400).json({
        success: false,
        error: 'Facebook Page ID এবং Access Token প্রয়োজন।'
      });
      return;
    }

    const graphUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(pageId)}?fields=id,name,picture{url},followers_count,link&access_token=${encodeURIComponent(pageAccessToken)}`;
    const response = await fetch(graphUrl);
    const data = await response.json();

    if (data.error) {
      res.status(400).json({
        success: false,
        error: data.error.message || 'ফেসবুক টোকেন ভ্যালিড নয়।',
        details: data.error
      });
      return;
    }

    res.json({
      success: true,
      page: {
        id: data.id,
        name: data.name,
        picture: data.picture?.data?.url || '',
        followers: data.followers_count || 0,
        link: data.link || `https://facebook.com/${data.id}`
      }
    });
  } catch (error: any) {
    console.error('Facebook verification error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'ফেসবুক সার্ভারের সাথে যোগাযোগ করা সম্ভব হয়নি।'
    });
  }
});

// Auto Post News to Facebook Page
app.post('/api/facebook/post-news', async (req, res) => {
  try {
    const { title, summary, category, imageUrl, newsId, pageId: reqPageId, pageAccessToken: reqAccessToken } = req.body;

    const pageId = reqPageId || process.env.FACEBOOK_PAGE_ID;
    const pageAccessToken = reqAccessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!title || !summary) {
      res.status(400).json({
        success: false,
        error: 'সংবাদের শিরোনাম এবং সারসংক্ষেপ প্রয়োজন।'
      });
      return;
    }

    if (!pageId || !pageAccessToken) {
      res.json({
        success: false,
        configured: false,
        error: 'ফেসবুক পেজ আইডি বা এক্সেস টোকেন কনফিগার করা নেই। অনুগ্রহ করে এডমিন ড্যাশবোর্ডে গিয়ে ফেসবুক ইন্টিগ্রেশন সেটিংসে টোকেন সেট করুন।'
      });
      return;
    }

    const categoryMap: Record<string, string> = {
      local: 'স্থানীয়_সংবাদ',
      emergency: 'জরুরি_ঘোষণা',
      development: 'উন্নয়ন_সংবাদ',
      sports: 'খেলাধুলা',
      health: 'স্বাস্থ্য_বুলেটিন',
      education: 'শিক্ষা_সংবাদ'
    };

    const categoryTag = categoryMap[category] || 'খবর';
    const siteUrl = process.env.APP_URL || 'https://hellomorrelgonj.gov.bd';
    const newsLink = newsId ? `${siteUrl}/#news-${newsId}` : siteUrl;

    const formattedMessage = `📰 ${title}

${summary}

🔗 বিস্তারিত পড়তে ভিসিট করুন: ${newsLink}

📍 হ্যালো মোড়েলগঞ্জ - উপজেলার ডিজিটাল বার্তা
#${categoryTag} #HelloMorrelganj #Morrelganj #মোড়েলগঞ্জ`;

    let fbRes;
    let endpointUrl;

    // Check if imageUrl is a public HTTP link (Graph API accepts image URL)
    if (imageUrl && imageUrl.startsWith('http')) {
      endpointUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(pageId)}/photos`;
      fbRes = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: imageUrl,
          caption: formattedMessage,
          access_token: pageAccessToken
        })
      });
    } else {
      // Feed text post with link
      endpointUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(pageId)}/feed`;
      fbRes = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: formattedMessage,
          link: newsLink,
          access_token: pageAccessToken
        })
      });
    }

    const fbData = await fbRes.json();

    if (fbData.error) {
      console.error('Facebook Graph API error:', fbData.error);
      res.status(400).json({
        success: false,
        configured: true,
        error: fbData.error.message || 'ফেসবুক পেজে পোস্ট করতে সমস্যা হয়েছে।',
        details: fbData.error
      });
      return;
    }

    const postId = fbData.id || fbData.post_id;
    res.json({
      success: true,
      configured: true,
      postId,
      postUrl: `https://facebook.com/${postId}`
    });
  } catch (error: any) {
    console.error('Facebook post error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'সার্ভার থেকে ফেসবুকে পোস্ট করার অনুরোধ ব্যর্থ হয়েছে।'
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
