const OpenAI = require("openai");

// Initialize OpenAI client once at module level for reuse
let openai;
const apiKey = process.env.OPENAI_API_KEY;

if (apiKey) {
  openai = new OpenAI({ 
    apiKey: apiKey,
    timeout: 20000, // 20 second timeout
    maxRetries: 1 // Don't retry on failure to keep responses fast
  });
  console.log('OpenAI client initialized successfully');
} else {
  console.error('OPENAI_API_KEY not found in environment');
}

// CORS settings - support both production and staging domains
const allowedOrigins = [
  "https://slater.cloud",
  "https://proud-smoke-0fa3b7e1e.6.azurestaticapps.net",
  "https://proud-smoke-0fa3b7e1e.1.azurestaticapps.net",
  "http://localhost:3000" // for local development
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

    // Call OpenAI with optimized settings
    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Much faster than gpt-4o
      messages: [
        {
          role: 'system',
          content: 'You are Jason Slater\'s AI assistant on his cloud resume website. Be helpful, concise, and professional. Keep responses brief unless asked for details.'
        },
        { 
          role: 'user', 
          content: userMessage 
        }
      ],
      max_tokens: 200, // Limit response length for speed
      temperature: 0.7
    });
    
    const aiReply = completion.choices[0].message.content;
    const responseTime = Date.now() - startTime;
    context.log(`OpenAI response time: ${responseTime}ms`);
    context.log('🤖 AI reply:', aiReply);

    context.res = { status: 200, headers: corsHeaders, body: { reply: aiReply } };
  } catch (err) {
    context.log.error('🚨 Error in function:', err);
    // Return more detailed error info for debugging
    const errorDetails = {
      error: err.message || 'Unknown error',
      type: err.name || 'Error',
      apiKeySet: !!process.env.OPENAI_API_KEY,
      apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
    };
    context.res = { status: 500, headers: corsHeaders, body: errorDetails };
  }
};

