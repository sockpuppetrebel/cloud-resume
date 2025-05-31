const OpenAIpkg = require("openai");

// Initialize OpenAI client (support v4 and v3 SDKs)
let openai;
if (typeof OpenAIpkg.OpenAI === 'function') {
  // v4+ default export style
  openai = new OpenAIpkg.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  // v3 style: Configuration + OpenAIApi
  const { Configuration, OpenAIApi } = OpenAIpkg;
  const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  openai = new OpenAIApi(config);
}

// CORS settings
const allowedOrigin = "https://slater.cloud";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

module.exports = async function (context, req) {
  context.log('⚡ Received request:', req.method, req.url);

  // Preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: corsHeaders };
    return;
  }

  // Only POST
  if (req.method !== 'POST') {
    context.res = { status: 405, headers: corsHeaders, body: 'Method Not Allowed' };
    return;
  }

  try {
    const userMessage = req.body?.message || '';
    context.log('💬 User message:', userMessage);

    // Call OpenAI
    let aiReply;
    if (openai.createChatCompletion) {
      // v3 SDK
      const resp = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      });
      aiReply = resp.data.choices[0].message.content;
    } else {
      // v4 SDK
      const resp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      });
      aiReply = resp.choices[0].message.content;
    }
    context.log('🤖 AI reply:', aiReply);

    context.res = { status: 200, headers: corsHeaders, body: { reply: aiReply } };
  } catch (err) {
    context.log.error('🚨 Error in function:', err);
    context.res = { status: 500, headers: corsHeaders, body: { error: err.message } };
  }
};

