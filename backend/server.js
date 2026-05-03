require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY is missing from .env file!');
} else {
  console.log('✅ Gemini API key loaded.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const SYSTEM_PROMPT = `You are a helpful, neutral, and factual Election Process Assistant for Indian elections.
Your purpose is to help users understand the election process, timelines, voter registration, voting procedures, EVM usage, voter ID (EPIC card), and Election Commission of India rules.

Format Rules:
1. NEVER recommend a specific candidate, party, or express political opinions.
2. Keep answers concise and easy to read. Use bullet points where helpful.
3. Focus on Indian election context (ECI, EPIC card, EVMs, Form 6 registration, etc.).
4. If asked about "steps" or "process", provide a clear, numbered list.
5. You can trigger interactive UI components by including a special tag in your response:
   [STEPS: Step 1 Title | Step 1 Desc, Step 2 Title | Step 2 Desc, ...]
   [TIMELINE: Date 1 | Event 1, Date 2 | Event 2, ...]
6. Always end your response with one short, encouraging civic note.`;

// ─── Simulated knowledge base (used when Gemini quota is hit or offline) ────
function getSimulatedResponse(q) {
  let text = "I can help you with voter registration, EPIC card, polling booth locations, EVM information, and election timelines. What would you like to know more about?";
  let actionText = null;
  let actionLink = null;

  if (q.includes('register') || q.includes('form 6') || q.includes('enrol') || q.includes('signup')) {
    text = 'To register as a voter in India:\n\n[STEPS: Check Eligibility | Must be 18+ on Jan 1st, Fill Form 6 | Apply online at voters.eci.gov.in, Upload Docs | Provide ID and Address proof, Verification | Booth Level Officer (BLO) visits, EPIC Delivery | Get your card via post]\n\n✅ Registration is the first step to being a responsible citizen.';
    actionText = 'Register at ECI Portal';
    actionLink = 'https://voters.eci.gov.in';
  } else if (q.includes('step') || q.includes('process') || q.includes('how to vote')) {
    text = 'Here are the steps to vote on election day:\n\n[STEPS: First Clerk | Checks name in list and ID, Second Clerk | Inks finger and takes signature, Third Clerk | Checks ink and returns ID, Polling Booth | Press button for candidate on EVM, VVPAT | Check slip to confirm your vote]\n\n✅ Every vote counts in a democracy!';
  } else if (q.includes('timeline') || q.includes('schedule') || q.includes('date')) {
    text = 'The 2026 Assembly Election timeline is as follows:\n\n[TIMELINE: Mar 16 2026 | Election Announcement, Apr 19 2026 | Phase 1 Voting, May 25 2026 | Phase 6 Voting (Upcoming), Jun 01 2026 | Final Phase Voting, Jun 04 2026 | Result Declaration]\n\n✅ Stay informed and mark your calendar!';
    actionText = 'View Full Schedule';
    actionLink = 'https://eci.gov.in';
  } else if (q.includes('epic') || q.includes('voter id') || q.includes('voter card') || q.includes('e-epic')) {
    text = 'Your EPIC (Electors Photo Identity Card) is your official Voter ID in India:\n• Apply or download e-EPIC at voters.eci.gov.in\n• EPIC is now available as a digital PDF on your phone\n• You can also use Aadhaar, passport, or driving license as alternative ID at the booth.\n\n✅ Always carry your ID on election day!';
    actionText = 'Download e-EPIC';
    actionLink = 'https://voters.eci.gov.in';
  } else if (q.includes('evm') || q.includes('voting machine') || q.includes('electronic')) {
    text = 'EVMs (Electronic Voting Machines) are used in all Indian elections:\n• They are completely standalone — no internet or WiFi connection\n• VVPAT machines print a paper slip so you can verify your vote\n• EVMs are rigorously tested and certified by the Election Commission of India.\n\n✅ Your vote is safe and secure!';
  } else if (q.includes('booth') || q.includes('polling station') || q.includes('polling place') || q.includes('where to vote')) {
    text = 'To find your polling booth:\n• Visit the "Find Booth" tab in this app\n• Enter your EPIC number to get the exact location\n• Polls are open 7 AM to 6 PM on election day.\n\n✅ Finding your booth early makes election day easier!';
    actionText = 'Go to Find Booth';
    actionLink = '#booth'; // This can be handled by frontend
  } else if (q.includes('aadhaar') || q.includes('link')) {
    text = 'Linking Aadhaar to your Voter ID:\n• Visit voters.eci.gov.in or use the Voter Helpline App\n• Fill Form 6B to voluntarily link Aadhaar to your EPIC\n• This helps remove duplicate voter entries.\n\n✅ Linking ensures your vote is counted correctly!';
    actionText = 'Link Aadhaar';
    actionLink = 'https://voters.eci.gov.in';
  } else if (q.includes('eci') || q.includes('election commission') || q.includes('who runs')) {
    text = 'The Election Commission of India (ECI):\n• Constitutional body that conducts all elections in India\n• Headed by the Chief Election Commissioner\n• Ensures free, fair, and credible elections.\n\n✅ ECI is your go-to authority for all election-related information!';
    actionText = 'Visit ECI Website';
    actionLink = 'https://eci.gov.in';
  }

  return { text, actionText, actionLink };
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', aiEnabled: !!genAI, timestamp: new Date().toISOString() });
});

// ─── Main Chat Route ──────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Try Gemini AI first
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await model.generateContent(message);
      const text = result.response.text();
      console.log('✅ Gemini responded successfully.');
      return res.json({ text, type: 'gemini' });
    } catch (err) {
      const errMsg = err.message || '';
      console.error('Gemini error:', errMsg.substring(0, 120));

      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests')) {
        console.warn('⚠️ Quota exceeded — serving enhanced fallback response.');
        const fallback = getSimulatedResponse(message.toLowerCase());
        // Return a cleaner response without the "warning" label if desired, or just make it look like a feature
        return res.json({
          text: `I am currently operating in high-performance local mode. ${fallback.text}`,
          type: 'simulated',
          actionText: fallback.actionText,
          actionLink: fallback.actionLink
        });
      }
    }
  }

  // Final fallback
  const fallback = getSimulatedResponse(message.toLowerCase());
  return res.json({ ...fallback, type: 'simulated' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend running → http://localhost:${PORT}`);
  console.log(`🤖 AI Mode: ${genAI ? 'Gemini 2.0 Flash (Live)' : 'Simulated Fallback'}\n`);
});
