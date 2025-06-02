// Simple Status Widget - No CSP Issues
document.addEventListener('DOMContentLoaded', function() {
  // Only show on desktop
  if (window.innerWidth <= 480) return;
  
  // Create widget
  const widget = document.createElement('div');
  widget.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 12px;
    color: white;
    font-family: Inter, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 1000;
    min-width: 180px;
  `;
  
  // Add content
  const dot = document.createElement('div');
  dot.style.cssText = `
    width: 8px;
    height: 8px;
    background: #00d4aa;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
  `;
  
  const text = document.createElement('span');
  text.textContent = 'All Systems Operational';
  
  const uptime = document.createElement('div');
  uptime.style.cssText = `
    font-size: 12px;
    color: #888;
    margin-top: 4px;
  `;
  uptime.textContent = 'Uptime: 99.9%';
  
  widget.appendChild(dot);
  widget.appendChild(text);
  widget.appendChild(uptime);
  
  document.body.appendChild(widget);
  
  // Fetch real status
  fetch('/api/uptime')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'operational') {
        dot.style.background = '#00d4aa';
        text.textContent = 'All Systems Operational';
      } else {
        dot.style.background = '#ff4444';
        text.textContent = 'Some Issues Detected';
      }
      uptime.textContent = 'Uptime: ' + data.summary.averageUptime + '%';
    })
    .catch(() => {
      dot.style.background = '#ffb700';
      text.textContent = 'Status Check Failed';
      uptime.textContent = 'Uptime: --.--%';
    });
});