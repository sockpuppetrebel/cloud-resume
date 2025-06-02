const OpenAI = require("openai");

module.exports = async function (context, req) {
  context.log('Testing API key configuration');
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  // Basic info (safe to log)
  const keyInfo = {
    present: !!apiKey,
    length: apiKey ? apiKey.length : 0,
    prefix: apiKey ? apiKey.substring(0, 15) + '...' : 'none',
    envVarsAvailable: Object.keys(process.env).filter(k => k.includes('OPENAI')),
    nodeVersion: process.version
  };
  
  // Try to use the key
  let testResult = {
    keyInfo,
    validation: null,
    error: null
  };
  
  if (apiKey) {
    try {
      const openai = new OpenAI({ apiKey });
      const models = await openai.models.list();
      testResult.validation = {
        success: true,
        modelsFound: models.data.length,
        sampleModel: models.data[0]?.id || 'none'
      };
    } catch (error) {
      testResult.validation = {
        success: false,
        error: error.message,
        statusCode: error.status,
        type: error.type
      };
    }
  }
  
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: testResult
  };
};