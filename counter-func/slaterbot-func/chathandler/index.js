// ChatHandler/index.js
module.exports = async function (context, req) {
  const allowedOrigin = 'https://jtsresumehosting.z5.web.core.windows.net';
  const corsHeaders = {
    'Access-Control-Allow-Origin' : allowedOrigin,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // 1) Handle preflight
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: corsHeaders
    };
    return;
  }

  // 2) Only accept POST here
  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      headers: corsHeaders,
      body: 'Method Not Allowed'
    };
    return;
  }

  // 3) Your normal GPT call logic
  let userMsg = '';
  try {
    userMsg = req.body?.message || '';
    // … call OpenAI, e.g. 
    const aiReply = await callOpenAI(userMsg); 
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: { reply: aiReply }
    };
  } catch (e) {
    context.log.error(e);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: { error: e.message }
    };
  }
};

