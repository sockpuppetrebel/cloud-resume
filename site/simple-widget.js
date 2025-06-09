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
  
  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'statusWidget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.left = '20px';
  widget.style.background = theme.background;
  widget.style.color = theme.color;
  widget.style.borderRadius = theme.borderRadius;
  widget.style.boxShadow = theme.boxShadow;
  widget.style.border = theme.border;
  widget.style.zIndex = '9999';
  widget.style.fontFamily = theme.fontFamily;
  widget.style.fontSize = '14px';
  widget.style.minWidth = '200px';
  widget.style.backdropFilter = 'blur(10px)';
  widget.style.overflow = 'hidden';
  widget.style.transition = 'all 0.3s ease';

  // Create header with drag handle and minimize button
  const header = document.createElement('div');
  header.id = 'statusHeader';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.padding = '12px 16px';
  header.style.background = 'rgba(0, 255, 65, 0.1)';
  header.style.borderBottom = '1px solid rgba(0, 255, 65, 0.2)';
  header.style.cursor = 'move';
  header.style.userSelect = 'none';

  const dragHandle = document.createElement('div');
  dragHandle.innerHTML = '⋮⋮';
  dragHandle.style.fontSize = '16px';
  dragHandle.style.cursor = 'grab';
  dragHandle.style.padding = '4px';
  dragHandle.style.borderRadius = '4px';
  dragHandle.style.transition = 'all 0.2s ease';
  dragHandle.style.color = theme.color;
  dragHandle.style.opacity = '0.7';

  const headerTitle = document.createElement('span');
  headerTitle.textContent = 'System Status';
  headerTitle.style.fontWeight = '600';
  headerTitle.style.fontSize = '14px';

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '4px';

  const closeBtn = document.createElement('button');
  closeBtn.id = 'statusCloseBtn';
  closeBtn.innerHTML = '×';
  closeBtn.style.background = 'rgba(255, 0, 0, 0.2)';
  closeBtn.style.border = 'none';
  closeBtn.style.color = theme.color;
  closeBtn.style.width = '20px';
  closeBtn.style.height = '20px';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.transition = 'all 0.2s ease';

  controls.appendChild(closeBtn);

  header.appendChild(dragHandle);
  header.appendChild(headerTitle);
  header.appendChild(controls);

  // Create body container
  const body = document.createElement('div');
  body.id = 'statusBody';
  body.style.padding = '16px';
  body.style.transition = 'all 0.3s ease';
  
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
  
  // Add content to body
  body.innerHTML = 
    '<div style="margin-bottom: 10px; font-weight: 600;"><span id="statusDot" style="color: ' + theme.dotColor + '; margin-right: 8px;">●</span>' + text.title + '</div>' +
    '<div id="uptimeDisplay" style="font-size: 24px; margin: 8px 0; color: ' + theme.dotColor + '; font-weight: 700;">--.--%</div>' +
    '<div id="statusText" style="margin-bottom: 10px; color: ' + theme.secondaryColor + '; font-size: 13px;">Checking status...</div>' +
    '<div id="detailsLink" style="color: ' + theme.accentColor + '; cursor: pointer; text-decoration: underline; font-weight: 500; font-size: 13px;">' + text.link + '</div>';
  
  // Assemble widget
  widget.appendChild(header);
  widget.appendChild(body);
  document.body.appendChild(widget);

  // Get reopen button
  const statusReopenBtn = document.getElementById('statusReopenBtn');

  // Enhanced state management
  const statusState = {
    position: JSON.parse(localStorage.getItem('statusPosition') || 'null'),
    isClosed: localStorage.getItem('statusClosed') === 'true'
  };

  // Function to validate and apply position
  function applyStatusPosition(savedPos) {
    if (savedPos) {
      // Get current viewport dimensions
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      // Validate position is within viewport
      const validX = Math.max(0, Math.min(savedPos.x, maxX));
      const validY = Math.max(0, Math.min(savedPos.y, maxY));
      
      // Only apply if position is reasonable
      if (validX >= 0 && validY >= 0) {
        widget.style.left = validX + 'px';
        widget.style.top = validY + 'px';
        widget.style.bottom = 'auto';
        return true;
      }
    }
    return false;
  }

  // Disable transitions during initialization
  widget.style.transition = 'none';
  
  // Load saved position with validation
  if (!applyStatusPosition(statusState.position)) {
    // Keep default position if saved position is invalid
    // Default position is already set in initial styles
  }
  
  // Re-enable transitions after position is set
  setTimeout(() => {
    widget.style.transition = 'all 0.3s ease';
  }, 100);

  // Load saved states on startup
  if (statusState.isClosed === true) {  // Explicit check for true
    widget.style.display = 'none';
    if (statusReopenBtn) {
      statusReopenBtn.style.display = 'flex';
    }
  } else {
    // Default to open state
    widget.style.display = 'block';
    if (statusReopenBtn) {
      statusReopenBtn.style.display = 'none';
    }
  }

  // Close functionality
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Add subtle flash effect for confirmation
    widget.style.border = '2px solid rgba(255, 0, 0, 0.6)';
    setTimeout(() => {
      widget.style.border = theme.border;
    }, 200);
    
    // Close with smooth animation
    setTimeout(() => {
      widget.style.opacity = '0';
      widget.style.transform = 'scale(0.8) translateY(20px)';
      setTimeout(() => {
        widget.style.display = 'none';
        if (statusReopenBtn) {
          statusReopenBtn.style.display = 'flex';
        }
        statusState.isClosed = true;
        localStorage.setItem('statusClosed', 'true');
      }, 400);
    }, 200);
  });

  // Reopen functionality
  if (statusReopenBtn) {
    statusReopenBtn.addEventListener('click', function() {
      statusReopenBtn.style.display = 'none';
      widget.style.display = 'block';
      
      // Force reset all widget styles
      setTimeout(() => {
        widget.style.opacity = '1';
        widget.style.transform = 'scale(1) translateY(0)';
        widget.style.transition = 'all 0.3s ease';
      }, 10);
      
      statusState.isClosed = false;
      localStorage.setItem('statusClosed', 'false');
    });
  }

  // Hover effects for drag handle
  dragHandle.addEventListener('mouseenter', function() {
    this.style.opacity = '1';
    this.style.background = 'rgba(0, 255, 65, 0.1)';
  });

  dragHandle.addEventListener('mouseleave', function() {
    this.style.opacity = '0.7';
    this.style.background = 'transparent';
  });

  closeBtn.addEventListener('mouseenter', function() {
    this.style.background = 'rgba(255, 0, 0, 0.4)';
    this.style.transform = 'scale(1.1)';
  });

  closeBtn.addEventListener('mouseleave', function() {
    this.style.background = 'rgba(255, 0, 0, 0.2)';
    this.style.transform = 'scale(1)';
  });

  // Collision detection function
  function checkCollision(newX, newY, currentWidget) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return false;
    
    const currentRect = {
      left: newX,
      top: newY,
      right: newX + currentWidget.offsetWidth,
      bottom: newY + currentWidget.offsetHeight
    };
    
    const chatRect = chatContainer.getBoundingClientRect();
    
    return !(currentRect.right < chatRect.left || 
             currentRect.left > chatRect.right || 
             currentRect.bottom < chatRect.top || 
             currentRect.top > chatRect.bottom);
  }

  // Drag functionality - only on desktop
  if (window.innerWidth > 768) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    header.addEventListener('mousedown', function(e) {
      // Only start drag if not clicking on close button
      if (e.target === closeBtn) {
        return;
      }
      
      isDragging = true;
      const rect = widget.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      
      header.style.cursor = 'grabbing';
      dragHandle.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep widget within viewport bounds
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      let boundedX = Math.max(0, Math.min(newX, maxX));
      let boundedY = Math.max(0, Math.min(newY, maxY));
      
      // Check for collision with chatbot and avoid overlap
      if (checkCollision(boundedX, boundedY, widget)) {
        // If collision detected, try to snap to edge
        const chatContainer = document.getElementById('chatContainer');
        const chatRect = chatContainer.getBoundingClientRect();
        
        // Determine which side to snap to based on drag direction
        if (newX < chatRect.left) {
          boundedX = Math.max(0, chatRect.left - widget.offsetWidth - 10);
        } else if (newX > chatRect.right) {
          boundedX = Math.min(maxX, chatRect.right + 10);
        }
        
        if (newY < chatRect.top) {
          boundedY = Math.max(0, chatRect.top - widget.offsetHeight - 10);
        } else if (newY > chatRect.bottom) {
          boundedY = Math.min(maxY, chatRect.bottom + 10);
        }
      }
      
      widget.style.left = boundedX + 'px';
      widget.style.top = boundedY + 'px';
      widget.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'move';
        dragHandle.style.cursor = 'grab';
        document.body.style.userSelect = '';
        
        // Save position to localStorage
        const rect = widget.getBoundingClientRect();
        statusState.position = { x: rect.left, y: rect.top };
        localStorage.setItem('statusPosition', JSON.stringify(statusState.position));
      }
    });
  }
  
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