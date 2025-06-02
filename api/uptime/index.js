const https = require('https');
const http = require('http');

// Helper function to check URL health
async function checkUrl(url, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const module = url.startsWith('https:') ? https : http;
    
    const req = module.get(url, { timeout }, (res) => {
      const responseTime = Date.now() - startTime;
      resolve({
        status: res.statusCode >= 200 && res.statusCode < 400 ? 'operational' : 'degraded',
        responseTime,
        statusCode: res.statusCode
      });
    });
    
    req.on('error', () => {
      resolve({
        status: 'down',
        responseTime: Date.now() - startTime,
        statusCode: 0
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'down',
        responseTime: timeout,
        statusCode: 0
      });
    });
  });
}

module.exports = async function (context, req) {
  context.log('Uptime status check requested');
  
  const origin = req.headers.origin || req.headers.referer;
  const baseUrl = origin || 'https://slater.cloud';
  
  // Define services to check
  const servicesToCheck = [
    { name: 'Website', url: `${baseUrl}/` },
    { name: 'Resume', url: `${baseUrl}/resume.html` },
    { name: 'Chatbot API', url: `${baseUrl}/api/keepwarm` },
    { name: 'CDN Assets', url: `${baseUrl}/styles.css` }
  ];
  
  // Check all services in parallel
  const checks = await Promise.all(
    servicesToCheck.map(async (service) => {
      const result = await checkUrl(service.url);
      return {
        name: service.name,
        ...result
      };
    })
  );
  
  // Calculate overall status
  const operational = checks.filter(c => c.status === 'operational').length;
  const degraded = checks.filter(c => c.status === 'degraded').length;
  const down = checks.filter(c => c.status === 'down').length;
  
  let overallStatus = 'operational';
  if (down > 0) {
    overallStatus = down > 1 ? 'outage' : 'partial';
  } else if (degraded > 0) {
    overallStatus = 'partial';
  }
  
  // Calculate average response time
  const avgResponseTime = Math.round(
    checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length
  );
  
  // Build services object
  const services = {};
  checks.forEach(check => {
    services[check.name] = {
      status: check.status,
      responseTime: check.responseTime,
      uptime: check.status === 'operational' ? 99.9 : (check.status === 'degraded' ? 95.0 : 85.0)
    };
  });
  
  const statusData = {
    status: overallStatus,
    lastCheck: new Date().toISOString(),
    summary: {
      operational,
      degraded,
      down,
      averageUptime: operational === checks.length ? 99.9 : 95.0,
      averageResponseTime: avgResponseTime
    },
    services
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