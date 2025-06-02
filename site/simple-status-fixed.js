// Simple Status Widget - CSP Compliant Version
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Status Widget] DOM loaded, starting initialization');
  
  // Only show on desktop
  if (window.innerWidth <= 480) {
    console.log('[Status Widget] Mobile device detected, skipping');
    return;
  }
  
  // Create widget
  const widget = document.createElement('div');
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.right = '20px';
  widget.style.background = '#1a1a2e';
  widget.style.border = '1px solid #333';
  widget.style.borderRadius = '8px';
  widget.style.padding = '12px';
  widget.style.color = 'white';
  widget.style.fontFamily = 'Inter, sans-serif';
  widget.style.fontSize = '14px';
  widget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  widget.style.zIndex = '1000';
  widget.style.minWidth = '180px';
  
  // Add content
  const dot = document.createElement('div');
  dot.style.width = '8px';
  dot.style.height = '8px';
  dot.style.background = '#00d4aa';
  dot.style.borderRadius = '50%';
  dot.style.display = 'inline-block';
  dot.style.marginRight = '8px';
  
  const text = document.createElement('span');
  text.textContent = 'All Systems Operational';
  
  const uptime = document.createElement('div');
  uptime.style.fontSize = '12px';
  uptime.style.color = '#888';
  uptime.style.marginTop = '4px';
  uptime.textContent = 'Uptime: 99.9%';
  
  widget.appendChild(dot);
  widget.appendChild(text);
  widget.appendChild(uptime);
  
  console.log('[Status Widget] Appending widget to body');
  document.body.appendChild(widget);
  console.log('[Status Widget] Widget created and appended successfully');
  
  // Fetch real status
  fetch('/api/uptime')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.status === 'operational') {
        dot.style.background = '#00d4aa';
        text.textContent = 'All Systems Operational';
      } else {
        dot.style.background = '#ff4444';
        text.textContent = 'Some Issues Detected';
      }
      uptime.textContent = 'Uptime: ' + data.summary.averageUptime + '%';
    })
    .catch(function() {
      dot.style.background = '#ffb700';
      text.textContent = 'Status Check Failed';
      uptime.textContent = 'Uptime: --.--%';
    });
});