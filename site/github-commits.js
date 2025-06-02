// GitHub Recent Commits with Code Snippets
class GitHubCommits {
  constructor() {
    this.username = 'sockpuppetrebel';
    this.repo = 'cloud-resume';
    this.container = document.getElementById('recentCommits');
    this.init();
  }

  async init() {
    try {
      await this.fetchRecentCommits();
    } catch (error) {
      console.error('Error fetching commits:', error);
      this.showError();
    }
  }

  async fetchRecentCommits() {
    const response = await fetch(`https://api.github.com/repos/${this.username}/${this.repo}/commits?per_page=3`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const commits = await response.json();
    await this.displayCommits(commits);
  }

  async displayCommits(commits) {
    this.container.innerHTML = '';
    
    for (const commit of commits) {
      const commitElement = await this.createCommitElement(commit);
      this.container.appendChild(commitElement);
    }
  }

  async createCommitElement(commit) {
    const commitDiv = document.createElement('div');
    commitDiv.className = 'commit-entry';
    
    // Get commit details with diff
    const diffData = await this.fetchCommitDiff(commit.sha);
    
    commitDiv.innerHTML = `
      <div class="commit-header">
        <span class="commit-hash">${commit.sha.substring(0, 7)}</span>
        <span class="commit-time">${this.formatDate(commit.commit.committer.date)}</span>
      </div>
      <div class="commit-message">${this.escapeHtml(commit.commit.message.split('\n')[0])}</div>
      ${diffData ? this.createDiffDisplay(diffData) : ''}
    `;
    
    return commitDiv;
  }

  async fetchCommitDiff(sha) {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.username}/${this.repo}/commits/${sha}`);
      if (!response.ok) return null;
      
      const commitData = await response.json();
      return commitData.files ? commitData.files.slice(0, 2) : null; // Show max 2 files
    } catch (error) {
      console.error('Error fetching diff:', error);
      return null;
    }
  }

  createDiffDisplay(files) {
    let diffHtml = '<div class="commit-diff">';
    
    files.forEach(file => {
      if (file.patch) {
        diffHtml += `<div class="file-header">📄 ${file.filename}</div>`;
        
        // Show only first few lines of patch
        const lines = file.patch.split('\n').slice(0, 8);
        lines.forEach(line => {
          let className = 'diff-context';
          if (line.startsWith('+') && !line.startsWith('+++')) {
            className = 'diff-add';
          } else if (line.startsWith('-') && !line.startsWith('---')) {
            className = 'diff-remove';
          }
          
          diffHtml += `<div class="diff-line ${className}">${this.escapeHtml(line)}</div>`;
        });
        
        if (file.patch.split('\n').length > 8) {
          diffHtml += `<div class="diff-line diff-context">... (+${file.patch.split('\n').length - 8} more lines)</div>`;
        }
      }
    });
    
    diffHtml += '</div>';
    return diffHtml;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError() {
    this.container.innerHTML = `
      <div class="error-message" style="color: #ff4444; text-align: center;">
        <div>⚠ Unable to load commits</div>
        <div style="font-size: 10px; margin-top: 4px;">Check console for details</div>
      </div>
    `;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GitHubCommits();
});