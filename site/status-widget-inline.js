// Status Widget JavaScript - Works with inline HTML
let statusData = null;
let statusPanelOpen = false;

// Configuration
const STATUS_API_URL = '/api/uptime';
const UPDATE_INTERVAL = 300000; // 5 minutes

// Update status display
function updateStatusDisplay(data) {
  statusData = data;
  
  // Update main widget
  const indicator = document.querySelector('.status-indicator');
  const uptimeText = document.querySelector('.status-uptime');
  const statusText = document.querySelector('.status-text');
  
  // Update indicator
  indicator.className = 'status-indicator ' + data.status;
  
  // Update uptime percentage
  uptimeText.textContent = data.summary.averageUptime + '%';
  
  // Update status text
  if (data.status === 'operational') {
    statusText.textContent = 'All systems operational';
  } else if (data.status === 'partial') {
    statusText.textContent = (data.summary.degraded + data.summary.down) + ' services affected';
  } else {
    statusText.textContent = 'Major outage detected';
  }
  
  // Update service list
  const serviceList = document.getElementById('serviceList');
  serviceList.innerHTML = '';
  
  Object.entries(data.services).forEach(function(entry) {
    const name = entry[0];
    const service = entry[1];
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    
    const responseTime = service.responseTime ? service.responseTime + 'ms' : '--';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'service-name';
    nameDiv.textContent = name;
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'service-status';
    
    const responseSpan = document.createElement('span');
    responseSpan.className = 'service-response';
    responseSpan.textContent = responseTime;
    
    const dotDiv = document.createElement('div');
    dotDiv.className = 'service-dot ' + service.status;
    
    statusDiv.appendChild(responseSpan);
    statusDiv.appendChild(dotDiv);
    
    serviceItem.appendChild(nameDiv);
    serviceItem.appendChild(statusDiv);
    
    serviceList.appendChild(serviceItem);
  });
  
  // Update last check time
  const lastCheckTime = document.getElementById('lastCheckTime');
  const checkTime = new Date(data.lastCheck);
  lastCheckTime.textContent = checkTime.toLocaleTimeString();
}

// Fetch status data
async function fetchStatus() {
  try {
    const response = await fetch(STATUS_API_URL);
    
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    
    const data = await response.json();
    updateStatusDisplay(data);
    
  } catch (error) {
    console.error('Error fetching status:', error);
    
    // Show error state
    const indicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    const uptimeText = document.querySelector('.status-uptime');
    
    if (indicator) indicator.className = 'status-indicator degraded';
    if (statusText) {
      statusText.textContent = 'Status check failed';
      statusText.style.color = '#ff6b6b';
    }
    if (uptimeText) uptimeText.textContent = '--.--%';
  }
}

// Toggle status panel
function toggleStatusPanel() {
  const panel = document.querySelector('.status-panel');
  statusPanelOpen = !statusPanelOpen;
  
  if (statusPanelOpen) {
    panel.classList.add('active');
  } else {
    panel.classList.remove('active');
  }
}

// Toggle minimize
function toggleMinimize() {
  const widget = document.querySelector('.status-widget');
  const content = document.querySelector('.status-content');
  const minimizeBtn = document.querySelector('.status-minimize');
  
  if (widget.classList.contains('minimized')) {
    widget.classList.remove('minimized');
    content.style.display = 'block';
    minimizeBtn.textContent = '−';
  } else {
    widget.classList.add('minimized');
    content.style.display = 'none';
    minimizeBtn.textContent = '+';
  }
}

// Set up event listeners
function setupEventListeners() {
  const detailsBtn = document.querySelector('.status-details');
  const minimizeBtn = document.querySelector('.status-minimize');
  
  if (detailsBtn) {
    detailsBtn.addEventListener('click', toggleStatusPanel);
  }
  
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', toggleMinimize);
  }
  
  // Close panel when clicking outside
  document.addEventListener('click', function(e) {
    if (statusPanelOpen && 
        !e.target.closest('.status-widget') && 
        !e.target.closest('.status-panel')) {
      toggleStatusPanel();
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only show on desktop or tablets
  if (window.innerWidth > 480) {
    // Widget HTML is already in the page, just set up functionality
    setupEventListeners();
    
    // Fetch initial status
    fetchStatus();
    
    // Update every 5 minutes
    setInterval(fetchStatus, UPDATE_INTERVAL);
  } else {
    // Hide widget on mobile
    const widget = document.querySelector('.status-widget');
    const panel = document.querySelector('.status-panel');
    if (widget) widget.style.display = 'none';
    if (panel) panel.style.display = 'none';
  }
});