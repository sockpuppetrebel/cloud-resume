const axios = require('axios');

// Services to monitor
const SERVICES = [
  {
    name: 'Main Website',
    url: 'https://slater.cloud',
    type: 'website'
  },
  {
    name: 'Staging Environment',
    url: 'https://proud-smoke-0fa3b7e1e.6.azurestaticapps.net',
    type: 'website'
  },
  {
    name: 'Resume API',
    url: 'https://slaterbot.azurewebsites.net/api/health',
    type: 'api'
  },
  {
    name: 'GitHub Profile',
    url: 'https://api.github.com/users/sockpuppetrebel',
    type: 'api'
  }
];

// In-memory storage (in production, use CosmosDB)
let uptimeData = {
  services: {},
  lastCheck: new Date().toISOString()
};

// Initialize service data
SERVICES.forEach(service => {
  uptimeData.services[service.name] = {
    url: service.url,
    type: service.type,
    status: 'unknown',
    uptime: 100,
    lastCheck: null,
    responseTime: null,
    history: []
  };
});

async function checkService(service) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(service.url, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });
    
    const responseTime = Date.now() - startTime;
    const isUp = response.status < 400;
    
    return {
      status: isUp ? 'operational' : 'degraded',
      responseTime,
      statusCode: response.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: null,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function updateAllServices() {
  const checks = await Promise.all(
    SERVICES.map(async (service) => {
      const result = await checkService(service);
      
      // Update service data
      const serviceData = uptimeData.services[service.name];
      serviceData.status = result.status;
      serviceData.lastCheck = result.timestamp;
      serviceData.responseTime = result.responseTime;
      
      // Add to history (keep last 100 checks)
      serviceData.history.push(result);
      if (serviceData.history.length > 100) {
        serviceData.history.shift();
      }
      
      // Calculate uptime percentage
      const totalChecks = serviceData.history.length;
      const successfulChecks = serviceData.history.filter(h => h.status === 'operational').length;
      serviceData.uptime = totalChecks > 0 ? (successfulChecks / totalChecks * 100).toFixed(2) : 100;
      
      return { service: service.name, result };
    })
  );
  
  uptimeData.lastCheck = new Date().toISOString();
  return checks;
}

module.exports = async function (context, req) {
  context.res.headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    context.res = { status: 200 };
    return;
  }

  // Check if we need to update (every 5 minutes)
  const lastCheckTime = new Date(uptimeData.lastCheck);
  const now = new Date();
  const timeSinceLastCheck = (now - lastCheckTime) / 1000 / 60; // minutes

  if (timeSinceLastCheck >= 5 || req.query.force === 'true') {
    await updateAllServices();
  }

  // Calculate overall status
  const allServices = Object.values(uptimeData.services);
  const operationalCount = allServices.filter(s => s.status === 'operational').length;
  const overallStatus = operationalCount === allServices.length ? 'operational' : 
                        operationalCount > allServices.length / 2 ? 'partial' : 'major';

  // Prepare response
  const response = {
    status: overallStatus,
    lastCheck: uptimeData.lastCheck,
    services: uptimeData.services,
    summary: {
      total: allServices.length,
      operational: operationalCount,
      degraded: allServices.filter(s => s.status === 'degraded').length,
      down: allServices.filter(s => s.status === 'down').length,
      averageUptime: (allServices.reduce((sum, s) => sum + parseFloat(s.uptime), 0) / allServices.length).toFixed(2)
    }
  };

  context.res = {
    status: 200,
    body: response
  };
};