const OpenAIpkg = require("openai");

// Initialize OpenAI client (support v4 and v3 SDKs)
let openai;
try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  if (typeof OpenAIpkg.OpenAI === 'function') {
    // v4+ default export style
    openai = new OpenAIpkg.OpenAI({ apiKey: apiKey });
  } else {
    // v3 style: Configuration + OpenAIApi
    const { Configuration, OpenAIApi } = OpenAIpkg;
    const config = new Configuration({ apiKey: apiKey });
    openai = new OpenAIApi(config);
  }
} catch (initError) {
  console.error('Failed to initialize OpenAI client:', initError.message);
}

// CORS settings - support both production and staging domains
const allowedOrigins = [
  "https://slater.cloud",
  "https://proud-smoke-0fa3b7e1e.6.azurestaticapps.net"
];

function getCorsHeaders(origin) {
  const isAllowed = allowedOrigins.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

module.exports = async function (context, req) {
  context.log('⚡ Received request:', req.method, req.url);
  
  const origin = req.headers.origin || req.headers.referer || allowedOrigins[0];
  const corsHeaders = getCorsHeaders(origin);

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
    if (!openai) {
      throw new Error('OpenAI client not initialized - check API key configuration');
    }
    
    const userMessage = req.body?.message || '';
    context.log('💬 User message:', userMessage);

    // Call OpenAI
    let aiReply;
    if (openai.createChatCompletion) {
      // v3 SDK
      const resp = await openai.createChatCompletion({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: userMessage }]
      });
      aiReply = resp.data.choices[0].message.content;
    } else {
      // v4 SDK
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
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

