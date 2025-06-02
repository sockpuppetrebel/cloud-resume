// Simple Status Widget - Basic Working Version
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 480) return; // Skip on mobile
  
  // Create widget
  const widget = document.createElement('div');
  widget.id = 'statusWidget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.left = '20px';
  widget.style.background = '#111111';
  widget.style.color = '#00ff41';
  widget.style.padding = '15px';
  widget.style.borderRadius = '8px';
  widget.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.3)';
  widget.style.zIndex = '9999';
  widget.style.fontFamily = 'Space Mono, monospace';
  widget.style.fontSize = '14px';
  widget.style.minWidth = '180px';
  widget.style.border = '1px solid #00ff41';
  
  // Add content
  widget.innerHTML = 
    '<div style="margin-bottom: 8px;"><span style="color: #39ff14;">●</span> SYSTEM STATUS</div>' +
    '<div style="font-size: 18px; margin: 5px 0; color: #39ff14;">99.9%</div>' +
    '<div style="margin-bottom: 8px; color: #00cc33;">ALL SYSTEMS OPERATIONAL</div>' +
    '<div id="detailsLink" style="color: #00ff41; cursor: pointer; text-decoration: underline; font-weight: bold;">[VIEW METRICS] →</div>';
  
  document.body.appendChild(widget);
  
  // Add click handler
  const detailsLink = document.getElementById('detailsLink');
  detailsLink.addEventListener('click', function() {
    alert('Details clicked! (This will be the status panel)');
  });
  
  console.log('Simple widget created successfully');
});