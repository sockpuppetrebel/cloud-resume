// Simple Status Widget - Basic Working Version
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 480) return; // Skip on mobile
  
  // Create widget
  const widget = document.createElement('div');
  widget.id = 'statusWidget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.left = '20px';
  widget.style.background = '#1a1a2e';
  widget.style.color = 'white';
  widget.style.padding = '15px';
  widget.style.borderRadius = '8px';
  widget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  widget.style.zIndex = '9999';
  widget.style.fontFamily = 'Arial, sans-serif';
  widget.style.fontSize = '14px';
  widget.style.minWidth = '180px';
  widget.style.border = '1px solid #333';
  
  // Add content
  widget.innerHTML = 
    '<div style="margin-bottom: 8px;"><span style="color: #00d4aa;">●</span> System Status</div>' +
    '<div style="font-size: 18px; margin: 5px 0;">99.9%</div>' +
    '<div style="margin-bottom: 8px;">All systems operational</div>' +
    '<div id="detailsLink" style="color: #4a9eff; cursor: pointer; text-decoration: underline;">View details →</div>';
  
  document.body.appendChild(widget);
  
  // Add click handler
  const detailsLink = document.getElementById('detailsLink');
  detailsLink.addEventListener('click', function() {
    alert('Details clicked! (This will be the status panel)');
  });
  
  console.log('Simple widget created successfully');
});