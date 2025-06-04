// Docker Widget - Dynamically positioned widget
(function() {
    // Create widget HTML
    const dockerWidget = document.createElement('div');
    dockerWidget.id = 'docker-widget';
    dockerWidget.className = 'docker-widget-floating';
    dockerWidget.innerHTML = `
        <div class="docker-project-card">
            <div class="docker-project-header">
                <h3>Live Docker Environment</h3>
                <div class="docker-project-status">
                    <span class="status-badge active">Running</span>
                </div>
            </div>
            <p class="docker-project-description">Interactive containerized development environment demonstrating Docker skills with live deployment.</p>
            <div class="docker-project-features">
                <span class="feature-tag">Container Orchestration</span>
                <span class="feature-tag">Development Environment</span>
            </div>
            <div class="docker-tech-stack">
                <span class="tech">Docker</span>
                <span class="tech">Nginx</span>
                <span class="tech">Multi-stage Build</span>
            </div>
            <div class="project-stats">
                <div class="stat">
                    <span class="stat-number">LIVE</span>
                    <span class="stat-label">Container</span>
                </div>
                <div class="stat">
                    <span class="stat-number">8081</span>
                    <span class="stat-label">Port</span>
                </div>
                <div class="stat">
                    <span class="stat-number">Nginx</span>
                    <span class="stat-label">Server</span>
                </div>
            </div>
            <div class="docker-project-links">
                <a href="http://localhost:8081" class="btn btn-primary" target="_blank">View Live Container</a>
                <a href="#" class="btn btn-secondary" onclick="navigator.clipboard.writeText('docker run -p 8081:80 cloud-resume-frontend'); alert('Docker command copied!'); return false;">Copy Command</a>
            </div>
        </div>
    `;

    // Wait for DOM to load
    function insertWidget() {
        console.log('Attempting to insert Docker widget...');
        const experienceSection = document.querySelector('#experience');
        console.log('Experience section found:', !!experienceSection);
        if (experienceSection) {
            // Append widget to experience section
            experienceSection.appendChild(dockerWidget);
            console.log('Docker widget inserted successfully');
        } else {
            console.error('Experience section not found!');
        }
    }

    // Try multiple strategies to ensure widget loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertWidget);
    } else {
        // DOM already loaded
        insertWidget();
    }

    // Add CSS for floating widget
    const style = document.createElement('style');
    style.textContent = `
        .docker-widget-floating {
            position: absolute;
            top: 200px;
            left: 10%;
            width: 450px;
            max-width: 40%;
            z-index: 10;
        }
        
        /* Make draggable for testing */
        .docker-widget-floating.draggable {
            cursor: move;
        }
        
        @media (max-width: 768px) {
            .docker-widget-floating {
                position: relative;
                top: auto;
                left: auto;
                width: 100%;
                max-width: 100%;
                margin: 20px auto;
            }
        }
    `;
    document.head.appendChild(style);

    // Optional: Make widget draggable for positioning
    window.enableDockerDrag = function() {
        const widget = document.getElementById('docker-widget');
        if (!widget) return;
        
        widget.classList.add('draggable');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        widget.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = widget.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            widget.style.position = 'fixed';
            widget.style.left = initialX + 'px';
            widget.style.top = initialY + 'px';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            widget.style.left = (initialX + deltaX) + 'px';
            widget.style.top = (initialY + deltaY) + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                console.log('Docker widget position:', {
                    top: widget.style.top,
                    left: widget.style.left
                });
            }
        });
    };
})();