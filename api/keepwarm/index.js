module.exports = async function (context, req) {
  context.log('Keep-warm function triggered');
  
  const response = {
    status: 'warm',
    timestamp: new Date().toISOString(),
    message: 'Function is warm and ready'
  };
  
  context.res = {
    status: 200,
    body: response
  };
};