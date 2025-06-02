// Status Widget JavaScript
let statusData = null;
let statusPanelOpen = false;

// Configuration
const STATUS_API_URL = 'https://slaterbot.azurewebsites.net/api/uptime';
const UPDATE_INTERVAL = 300000; // 5 minutes

// Create status widget HTML
function createStatusWidget() {
  const widget = document.createElement('div');
  widget.className = 'status-widget';
  widget.innerHTML = `
    <div class="status-header">
      <div class="status-indicator operational"></div>
      <span>System Status</span>
    </div>
    <div class="status-uptime">--.--%</div>
    <div class="status-text">Loading status...</div>
    <div class="status-details" onclick="toggleStatusPanel()">View details →</div>
  `;
  
  const panel = document.createElement('div');
  panel.className = 'status-panel';
  panel.innerHTML = `
    <h3 style="margin-top: 0; color: var(--text-primary);">Service Status</h3>
    <div class="service-list" id="serviceList">
      <div style="text-align: center; color: var(--text-secondary);">Loading services...</div>
    </div>
    <div style="margin-top: 1rem; text-align: center; font-size: 0.8rem; color: var(--text-secondary);">
      Last checked: <span id="lastCheckTime">--</span>
    </div>
  `;
  
  document.body.appendChild(widget);
  document.body.appendChild(panel);
}

// Update status display
function updateStatusDisplay(data) {
  statusData = data;
  
  // Update main widget
  const indicator = document.querySelector('.status-indicator');
  const uptimeText = document.querySelector('.status-uptime');
  const statusText = document.querySelector('.status-text');
  
  // Update indicator
  indicator.className = `status-indicator ${data.status}`;
  
  // Update uptime percentage
  uptimeText.textContent = `${data.summary.averageUptime}%`;
  
  // Update status text
  if (data.status === 'operational') {
    statusText.textContent = 'All systems operational';
  } else if (data.status === 'partial') {
    statusText.textContent = `${data.summary.degraded + data.summary.down} services affected`;
  } else {
    statusText.textContent = 'Major outage detected';
  }
  
  // Update service list
  const serviceList = document.getElementById('serviceList');
  serviceList.innerHTML = '';
  
  Object.entries(data.services).forEach(([name, service]) => {
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    
    const responseTime = service.responseTime ? `${service.responseTime}ms` : '--';
    
    serviceItem.innerHTML = `
      <div class="service-name">${name}</div>
      <div class="service-status">
        <span class="service-response">${responseTime}</span>
        <div class="service-dot ${service.status}"></div>
      </div>
    `;
    
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
    if (!response.ok) throw new Error('Failed to fetch status');
    
    const data = await response.json();
    updateStatusDisplay(data);
  } catch (error) {
    console.error('Error fetching status:', error);
    
    // Show error state
    const statusText = document.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = 'Unable to fetch status';
    }
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

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  if (statusPanelOpen && 
      !e.target.closest('.status-widget') && 
      !e.target.closest('.status-panel')) {
    toggleStatusPanel();
  }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only show on desktop or tablets
  if (window.innerWidth > 480) {
    createStatusWidget();
    fetchStatus();
    
    // Update every 5 minutes
    setInterval(fetchStatus, UPDATE_INTERVAL);
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const widget = document.querySelector('.status-widget');
    const panel = document.querySelector('.status-panel');
    
    if (window.innerWidth <= 480) {
      // Hide on mobile
      if (widget) widget.style.display = 'none';
      if (panel) panel.style.display = 'none';
    } else {
      // Show on desktop
      if (widget) widget.style.display = 'block';
      if (panel && statusPanelOpen) panel.style.display = 'block';
    }
  }, 250);
});