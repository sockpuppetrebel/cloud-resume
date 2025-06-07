class AzurePipelineWidget {
    constructor(containerId) {
        this.containerId = containerId;
        this.apiEndpoint = 'https://jslaterdevjournal.blob.core.windows.net/claude-development-journal/index.json';
        this.timelineEndpoint = 'https://jslaterdevjournal.blob.core.windows.net/claude-development-journal/learning-timeline/timeline.json';
        this.isLoading = false;
        this.data = null;
        this.timelineData = null;
        this.init();
    }

    init() {
        this.createWidget();
        this.loadData();
        // Refresh every 30 seconds
        setInterval(() => this.loadData(), 30000);
    }

    createWidget() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="azure-pipeline-widget">
                <div class="widget-header">
                    <div class="terminal-bar">
                        <span class="terminal-button red"></span>
                        <span class="terminal-button yellow"></span>
                        <span class="terminal-button green"></span>
                    </div>
                    <div class="widget-title">
                        <span class="prompt">jason@azure:~$</span> ./pipeline-status.sh
                    </div>
                </div>
                <div class="widget-content">
                    <div class="ascii-header">
    ┌─────────────────── AZURE PIPELINE ───────────────────┐
    │  ╔═══════════════════════════════════════════════╗   │
    │  ║  PowerShell → Azure Blob → Live API         ║   │
    │  ╚═══════════════════════════════════════════════╝   │
    └───────────────────────────────────────────────────────┘
                    </div>
                    <div class="status-grid">
                        <div class="status-item">
                            <span class="status-label">API Status:</span>
                            <span id="api-status" class="status-value loading">
                                <span class="spinner">●</span> CHECKING...
                            </span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Last Sync:</span>
                            <span id="last-sync" class="status-value">--:--</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Learning Items:</span>
                            <span id="item-count" class="status-value">--</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Latest Entry:</span>
                            <span id="latest-entry" class="status-value">Loading...</span>
                        </div>
                    </div>
                    <div class="pipeline-flow">
                        <div class="flow-step">
                            <div class="step-icon">[JSON]</div>
                            <div class="step-label">learning-timeline.json</div>
                            <div class="step-arrow">➜</div>
                        </div>
                        <div class="flow-step">
                            <div class="step-icon">&lt;PS&gt;</div>
                            <div class="step-label">PowerShell Script</div>
                            <div class="step-arrow">➜</div>
                        </div>
                        <div class="flow-step">
                            <div class="step-icon">☁</div>
                            <div class="step-label">Azure Blob Storage</div>
                            <div class="step-arrow">➜</div>
                        </div>
                        <div class="flow-step">
                            <div class="step-icon">{API}</div>
                            <div class="step-label">Public API</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button id="refresh-btn" class="terminal-btn">
                            <span class="btn-icon">↻</span> REFRESH STATUS
                        </button>
                        <button id="view-api-btn" class="terminal-btn">
                            <span class="btn-icon">→</span> VIEW LIVE API
                        </button>
                        <button id="view-scripts-btn" class="terminal-btn">
                            <span class="btn-icon">&lt;/&gt;</span> VIEW SCRIPTS
                        </button>
                    </div>
                    <div class="terminal-output" id="terminal-output">
                        <div class="output-line">
                            <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                            <span class="log-info">INFO:</span> Azure Pipeline Widget initialized
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadData(true);
        });

        document.getElementById('view-api-btn').addEventListener('click', () => {
            window.open(this.apiEndpoint, '_blank');
        });

        document.getElementById('view-scripts-btn').addEventListener('click', () => {
            window.open('https://github.com/jslater89/pwsh_honeypot/tree/main/scripts/azure', '_blank');
        });
    }

    async loadData(forceRefresh = false) {
        if (this.isLoading && !forceRefresh) return;
        
        this.isLoading = true;
        this.addLog('Fetching pipeline data...', 'info');

        try {
            // Load main index
            const indexResponse = await fetch(this.apiEndpoint);
            if (!indexResponse.ok) throw new Error(`HTTP ${indexResponse.status}`);
            this.data = await indexResponse.json();

            // Try to load timeline data
            try {
                const timelineResponse = await fetch(this.timelineEndpoint);
                if (timelineResponse.ok) {
                    this.timelineData = await timelineResponse.json();
                }
            } catch (e) {
                this.addLog('Timeline endpoint not accessible', 'warn');
            }

            this.updateDisplay();
            this.addLog('Pipeline data loaded successfully', 'success');
        } catch (error) {
            this.handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    updateDisplay() {
        // Update API status
        const statusEl = document.getElementById('api-status');
        statusEl.innerHTML = '<span class="status-online">●</span> ONLINE';
        statusEl.className = 'status-value online';

        // Update last sync (use timeline data if available, fallback to index)
        const lastSyncEl = document.getElementById('last-sync');
        let lastSync = 'Unknown';
        if (this.timelineData && this.timelineData.LastUpdated) {
            lastSync = new Date(this.timelineData.LastUpdated).toLocaleString();
        } else if (this.data && this.data.last_updated) {
            lastSync = new Date(this.data.last_updated).toLocaleString();
        }
        lastSyncEl.textContent = lastSync;

        // Update item count
        const itemCountEl = document.getElementById('item-count');
        let itemCount = 0;
        if (this.timelineData && this.timelineData.TotalItems) {
            itemCount = this.timelineData.TotalItems;
        } else if (this.data && this.data.LearningTimeline && this.data.LearningTimeline.ItemCount) {
            itemCount = this.data.LearningTimeline.ItemCount;
        }
        itemCountEl.textContent = itemCount;

        // Update latest entry
        const latestEl = document.getElementById('latest-entry');
        let latestEntry = 'No data available';
        if (this.timelineData && this.timelineData.Items && this.timelineData.Items.length > 0) {
            latestEntry = this.timelineData.Items[0].Title || 'Unknown';
        }
        latestEl.textContent = latestEntry;
    }

    handleError(error) {
        const statusEl = document.getElementById('api-status');
        statusEl.innerHTML = '<span class="status-offline">●</span> OFFLINE';
        statusEl.className = 'status-value offline';
        
        this.addLog(`Error: ${error.message}`, 'error');
    }

    addLog(message, type = 'info') {
        const output = document.getElementById('terminal-output');
        const timestamp = new Date().toLocaleTimeString();
        const logClass = `log-${type}`;
        
        const logLine = document.createElement('div');
        logLine.className = 'output-line';
        logLine.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="${logClass}">${type.toUpperCase()}:</span> ${message}
        `;
        
        output.appendChild(logLine);
        output.scrollTop = output.scrollHeight;
        
        // Keep only last 5 log entries
        while (output.children.length > 5) {
            output.removeChild(output.firstChild);
        }
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('azure-pipeline-widget');
    if (container) {
        new AzurePipelineWidget('azure-pipeline-widget');
    }
});