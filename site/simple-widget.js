// Status Widget with 3 Switchable Themes
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 480) return; // Skip on mobile
  
  // CHANGE THIS LINE TO SWITCH THEMES: 'minimal', 'hacker', or 'modern'
  const THEME = 'modern';
  
  // Theme definitions
  const themes = {
    minimal: {
      background: '#ffffff',
      color: '#333333',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Inter, sans-serif',
      dotColor: '#22c55e',
      accentColor: '#3b82f6',
      secondaryColor: '#6b7280'
    },
    hacker: {
      background: '#000000',
      color: '#00ff41',
      border: '1px solid #00ff41',
      borderRadius: '4px',
      boxShadow: '0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)',
      fontFamily: 'Space Mono, monospace',
      dotColor: '#39ff14',
      accentColor: '#00ff41',
      secondaryColor: '#00cc33'
    },
    modern: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3), 0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Inter, sans-serif',
      dotColor: '#34d399',
      accentColor: '#fbbf24',
      secondaryColor: '#e5e7eb'
    }
  };
  
  const theme = themes[THEME];
  
  // Create widget
  const widget = document.createElement('div');
  widget.id = 'statusWidget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.left = '20px';
  widget.style.background = theme.background;
  widget.style.color = theme.color;
  widget.style.padding = '16px';
  widget.style.borderRadius = theme.borderRadius;
  widget.style.boxShadow = theme.boxShadow;
  widget.style.border = theme.border;
  widget.style.zIndex = '9999';
  widget.style.fontFamily = theme.fontFamily;
  widget.style.fontSize = '14px';
  widget.style.minWidth = '200px';
  widget.style.backdropFilter = 'blur(10px)';
  
  // Theme-specific content
  const content = {
    minimal: {
      title: 'System Status',
      uptime: '99.9%',
      status: 'All systems operational',
      link: 'View details →'
    },
    hacker: {
      title: 'SYSTEM STATUS',
      uptime: '99.9%',
      status: 'ALL SYSTEMS OPERATIONAL',
      link: '[ACCESS METRICS] →'
    },
    modern: {
      title: 'System Status',
      uptime: '99.9%',
      status: 'All systems operational',
      link: 'View details →'
    }
  };
  
  const text = content[THEME];
  
  // Add content
  widget.innerHTML = 
    '<div style="margin-bottom: 10px; font-weight: 600;"><span style="color: ' + theme.dotColor + '; margin-right: 8px;">●</span>' + text.title + '</div>' +
    '<div style="font-size: 24px; margin: 8px 0; color: ' + theme.dotColor + '; font-weight: 700;">' + text.uptime + '</div>' +
    '<div style="margin-bottom: 10px; color: ' + theme.secondaryColor + '; font-size: 13px;">' + text.status + '</div>' +
    '<div id="detailsLink" style="color: ' + theme.accentColor + '; cursor: pointer; text-decoration: underline; font-weight: 500; font-size: 13px;">' + text.link + '</div>';
  
  document.body.appendChild(widget);
  
  // Add click handler
  const detailsLink = document.getElementById('detailsLink');
  detailsLink.addEventListener('click', function() {
    alert('Details clicked! Theme: ' + THEME);
  });
  
  console.log('Widget created with theme:', THEME);
});