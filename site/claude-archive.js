// Claude Archive Browser
class ClaudeArchiveBrowser {
    constructor() {
        this.apiBaseUrl = 'https://jslaterdevjournal.blob.core.windows.net/claude-development-journal';
        this.archiveData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadArchiveData();
            this.renderArchiveStats();
            this.renderArchiveGrid();
        } catch (error) {
            console.error('Failed to load archive data:', error);
            this.renderError();
        }
    }

    async loadArchiveData() {
        const response = await fetch(`${this.apiBaseUrl}/index.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        this.archiveData = await response.json();
    }

    renderArchiveStats() {
        const statsElement = document.getElementById('archiveStats');
        if (!statsElement || !this.archiveData) return;

        const lastUpdated = new Date(this.archiveData.last_updated).toLocaleDateString();
        statsElement.innerHTML = `
            <span class="stat-item">
                <strong>${this.archiveData.total_projects}</strong> Projects
            </span>
            <span class="stat-item">
                Last Updated: <strong>${lastUpdated}</strong>
            </span>
        `;
    }

    async renderArchiveGrid() {
        const gridElement = document.getElementById('archiveGrid');
        if (!gridElement || !this.archiveData) return;

        try {
            const projectCards = await Promise.all(
                this.archiveData.projects.map(project => this.createProjectCard(project))
            );
            
            gridElement.innerHTML = projectCards.join('');
            this.attachEventListeners();
        } catch (error) {
            console.error('Failed to render archive grid:', error);
            gridElement.innerHTML = '<div class="error">Failed to load project data</div>';
        }
    }

    async createProjectCard(projectName) {
        try {
            // Load project metadata
            const metadataUrl = `${this.apiBaseUrl}/projects/${projectName}/2025/06/metadata.json`;
            const response = await fetch(metadataUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to load metadata for ${projectName}`);
            }
            
            const metadata = await response.json();
            const fileInfo = metadata.file_list[0] || {};
            const fileSize = this.formatFileSize(fileInfo.size || 0);
            const uploadDate = fileInfo.upload_date ? 
                new Date(fileInfo.upload_date).toLocaleDateString() : 'Unknown';

            return `
                <div class="archive-card" data-project="${projectName}">
                    <div class="archive-card-header">
                        <h4>${this.formatProjectName(projectName)}</h4>
                        <span class="archive-status">Active</span>
                    </div>
                    <div class="archive-card-content">
                        <p>${metadata.description}</p>
                        <div class="archive-stats">
                            <div class="stat">
                                <span class="stat-value">${fileSize}</span>
                                <span class="stat-label">Size</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">${uploadDate}</span>
                                <span class="stat-label">Updated</span>
                            </div>
                        </div>
                    </div>
                    <div class="archive-card-actions">
                        <button class="btn btn-primary view-archive" data-project="${projectName}">
                            View Archive
                        </button>
                        <button class="btn btn-secondary view-metadata" data-project="${projectName}">
                            Metadata
                        </button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(`Failed to create card for ${projectName}:`, error);
            return `
                <div class="archive-card error-card">
                    <div class="archive-card-header">
                        <h4>${this.formatProjectName(projectName)}</h4>
                        <span class="archive-status error">Error</span>
                    </div>
                    <div class="archive-card-content">
                        <p>Failed to load project data</p>
                    </div>
                </div>
            `;
        }
    }

    attachEventListeners() {
        // View archive buttons
        document.querySelectorAll('.view-archive').forEach(button => {
            button.addEventListener('click', (e) => {
                const project = e.target.dataset.project;
                this.viewArchive(project);
            });
        });

        // View metadata buttons
        document.querySelectorAll('.view-metadata').forEach(button => {
            button.addEventListener('click', (e) => {
                const project = e.target.dataset.project;
                this.viewMetadata(project);
            });
        });
    }

    viewArchive(projectName) {
        const archiveUrl = `${this.apiBaseUrl}/projects/${projectName}/2025/06/CLAUDE_20250604.md`;
        window.open(archiveUrl, '_blank');
    }

    viewMetadata(projectName) {
        const metadataUrl = `${this.apiBaseUrl}/projects/${projectName}/2025/06/metadata.json`;
        window.open(metadataUrl, '_blank');
    }

    formatProjectName(projectName) {
        return projectName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    renderError() {
        const gridElement = document.getElementById('archiveGrid');
        const statsElement = document.getElementById('archiveStats');
        
        if (gridElement) {
            gridElement.innerHTML = `
                <div class="error-message">
                    <h4>Unable to load archive data</h4>
                    <p>The Claude.md archive system may be temporarily unavailable.</p>
                    <a href="${this.apiBaseUrl}/index.json" class="btn btn-secondary" target="_blank">
                        Try Direct API Access
                    </a>
                </div>
            `;
        }
        
        if (statsElement) {
            statsElement.innerHTML = '<span class="error">Archive data unavailable</span>';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a page with the archive section
    if (document.getElementById('archiveGrid')) {
        new ClaudeArchiveBrowser();
    }
});