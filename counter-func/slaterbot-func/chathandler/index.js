module.exports = async function (context, req) {
  // If this is a preflight request, just return the headers
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin' : 'https://jtsresumehosting.z5.web.core.windows.net',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
    return;
  }

  // Your normal handler
  const userMsg = req.body?.message || '';
  // (…call OpenAI, etc…)
  const aiReply = await callOpenAI(userMsg);

  context.res = {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://jtsresumehosting.z5.web.core.windows.net',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: { reply: aiReply }
  };
};

