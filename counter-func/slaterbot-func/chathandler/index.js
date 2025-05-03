const { Configuration, OpenAIApi } = require("openai");

// CORS settings
const allowedOrigin = "https://jtsresumehosting.z5.web.core.windows.net";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// Wrap OpenAI call
async function callOpenAI(message) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }]
  });
  return response.data.choices[0].message.content;
}

// Azure Function handler
module.exports = async function (context, req) {
  context.log('⚡ Received request:', req.method, req.url);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: corsHeaders };
    return;
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    context.res = { status: 405, headers: corsHeaders, body: 'Method Not Allowed' };
    return;
  }

  try {
    const userMessage = req.body?.message || '';
    context.log('💬 User message:', userMessage);

    const aiReply = await callOpenAI(userMessage);
    context.log('🤖 AI reply:', aiReply);

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: { reply: aiReply }
    };
  } catch (err) {
    context.log.error('🚨 Error in function:', err);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: { error: err.message }
    };
  }
};

