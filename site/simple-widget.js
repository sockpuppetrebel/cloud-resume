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
      background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0a0a0a 100%)',
      color: '#00ff41',
      border: '1px solid rgba(0, 255, 65, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 255, 65, 0.2), 0 2px 8px rgba(0,0,0,0.3)',
      fontFamily: 'Inter, sans-serif',
      dotColor: '#39ff14',
      accentColor: '#00cc33',
      secondaryColor: '#888888'
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
    '<div style="margin-bottom: 10px; font-weight: 600;"><span id="statusDot" style="color: ' + theme.dotColor + '; margin-right: 8px;">●</span>' + text.title + '</div>' +
    '<div id="uptimeDisplay" style="font-size: 24px; margin: 8px 0; color: ' + theme.dotColor + '; font-weight: 700;">--.--%</div>' +
    '<div id="statusText" style="margin-bottom: 10px; color: ' + theme.secondaryColor + '; font-size: 13px;">Checking status...</div>' +
    '<div id="detailsLink" style="color: ' + theme.accentColor + '; cursor: pointer; text-decoration: underline; font-weight: 500; font-size: 13px;">' + text.link + '</div>';
  
  document.body.appendChild(widget);
  
  // Create metrics panel
  const panel = document.createElement('div');
  panel.id = 'metricsPanel';
  panel.style.position = 'fixed';
  panel.style.bottom = '100px';
  panel.style.left = '20px';
  panel.style.background = theme.background;
  panel.style.color = theme.color;
  panel.style.border = theme.border;
  panel.style.borderRadius = theme.borderRadius;
  panel.style.boxShadow = theme.boxShadow;
  panel.style.padding = '20px';
  panel.style.width = '350px';
  panel.style.maxHeight = '400px';
  panel.style.overflowY = 'auto';
  panel.style.fontFamily = theme.fontFamily;
  panel.style.fontSize = '14px';
  panel.style.display = 'none';
  panel.style.backdropFilter = 'blur(10px)';
  panel.style.zIndex = '10000';
  
  panel.innerHTML = '<div style="color: ' + theme.dotColor + '; font-weight: 600; margin-bottom: 15px;">System Metrics</div><div id="metricsContent">Loading metrics...</div>';
  
  document.body.appendChild(panel);
  
  let panelOpen = false;
  
  // Add click handler for details link
  const detailsLink = document.getElementById('detailsLink');
  detailsLink.addEventListener('click', function() {
    panelOpen = !panelOpen;
    if (panelOpen) {
      panel.style.display = 'block';
      fetchMetrics();
    } else {
      panel.style.display = 'none';
    }
  });
  
  // Close panel when clicking outside
  document.addEventListener('click', function(e) {
    if (panelOpen && !e.target.closest('#statusWidget') && !e.target.closest('#metricsPanel')) {
      panelOpen = false;
      panel.style.display = 'none';
    }
  });
  
  // Update main widget display
  function updateWidgetDisplay(data) {
    const uptimeDisplay = document.getElementById('uptimeDisplay');
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');
    
    if (data) {
      uptimeDisplay.textContent = data.summary.averageUptime + '%';
      
      if (data.status === 'operational') {
        statusText.textContent = text.status;
        statusDot.style.color = theme.dotColor;
      } else {
        statusText.textContent = 'Some services degraded';
        statusDot.style.color = '#ff6b6b';
      }
    }
  }
  
  // Fetch live metrics
  function fetchMetrics() {
    fetch('/api/uptime')
      .then(response => response.json())
      .then(data => {
        // Update main widget
        updateWidgetDisplay(data);
        
        // Update metrics panel if open
        const content = document.getElementById('metricsContent');
        let html = '';
        
        // Overall status
        html += '<div style="margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">';
        html += '<div style="color: ' + theme.dotColor + '; font-weight: 600;">Overall Status</div>';
        html += '<div style="color: ' + theme.secondaryColor + '; font-size: 13px; margin-top: 4px;">Uptime: ' + data.summary.averageUptime + '%</div>';
        html += '</div>';
        
        // Services
        html += '<div style="color: ' + theme.dotColor + '; font-weight: 600; margin-bottom: 10px;">Services</div>';
        
        Object.entries(data.services).forEach(([name, service]) => {
          const statusColor = service.status === 'operational' ? theme.dotColor : '#ff6b6b';
          const responseTime = service.responseTime ? service.responseTime + 'ms' : '--';
          
          html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">';
          html += '<div>';
          html += '<div style="color: ' + theme.color + '; font-weight: 500;">' + name + '</div>';
          html += '<div style="color: ' + theme.secondaryColor + '; font-size: 12px;">Response: ' + responseTime + '</div>';
          html += '</div>';
          html += '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + statusColor + ';"></div>';
          html += '</div>';
        });
        
        // Last check
        const checkTime = new Date(data.lastCheck);
        html += '<div style="margin-top: 15px; color: ' + theme.secondaryColor + '; font-size: 12px; text-align: center;">Last checked: ' + checkTime.toLocaleTimeString() + '</div>';
        
        content.innerHTML = html;
      })
      .catch(error => {
        console.error('Error fetching metrics:', error);
        document.getElementById('metricsContent').innerHTML = '<div style="color: #ff6b6b; text-align: center;">Failed to load metrics</div>';
        
        // Update widget to show error
        document.getElementById('uptimeDisplay').textContent = '--.--%';
        document.getElementById('statusText').textContent = 'Status check failed';
        document.getElementById('statusDot').style.color = '#ff6b6b';
      });
  }
  
  // Fetch initial status for widget
  fetchMetrics();
  
  console.log('Widget created with theme:', THEME);
});