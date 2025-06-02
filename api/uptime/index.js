module.exports = async function (context, req) {
  context.log('Uptime status check requested');
  
  // Mock uptime data - in production, this would check real services
  const statusData = {
    status: 'operational',
    lastCheck: new Date().toISOString(),
    summary: {
      operational: 4,
      degraded: 0,
      down: 0,
      averageUptime: 99.9
    },
    services: {
      'Website': {
        status: 'operational',
        responseTime: 45,
        uptime: 99.99
      },
      'API': {
        status: 'operational',
        responseTime: 120,
        uptime: 99.95
      },
      'Chatbot': {
        status: 'operational',
        responseTime: 250,
        uptime: 99.9
      },
      'CDN': {
        status: 'operational',
        responseTime: 15,
        uptime: 100
      }
    }
  };
  
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: statusData
  };
};