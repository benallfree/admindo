import pkg from '../package.json' with { type: 'json' }

const rootPath = pkg.name

const fetch = (path) => {
  return window.AdminDO.fetch(`/${rootPath}${path}`)
}

/**
 * AdminDO Stats Plugin
 * A web component plugin that displays statistics
 */

// Stats main component
class StatsComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  disconnectedCallback() {
    // Clean up if needed
  }

  async render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
        }
        
        .stats-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e7;
          margin-top: 1rem;
        }
        
        .stats-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1d1d1f;
        }
        
        .stats-content {
          font-family: system-ui, -apple-system, sans-serif;
          padding: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .stat-item {
          transition: transform 0.2s ease;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e5e7;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .stat-icon {
          font-size: 1.25rem;
        }

        .stat-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1d1d1f;
        }

        .stat-description {
          font-size: 0.875rem;
          color: #6e6e73;
          margin-bottom: 0.75rem;
        }

        .progress-bar {
          height: 8px;
          background: #f5f5f7;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: var(--progress-color, #007AFF);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-value {
          font-size: 0.875rem;
          color: #6e6e73;
          text-align: right;
        }
        
        .loading {
          color: #6e6e73;
          font-style: italic;
        }
        
        .error {
          color: #dc3545;
        }
      </style>
      
        <div class="stats-content" id="stats-content">
          <div class="loading">Loading stats...</div>
        </div>
    `

    // Fetch stats data using AdminDO.fetch()
    await this.loadStats()
  }

  async loadStats() {
    const statsContent = this.shadowRoot.querySelector('#stats-content')
    if (!statsContent) return

    try {
      const response = await fetch('/info')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      statsContent.innerHTML = `
        <div class="stats-grid">
          ${data
            .map(
              (stat) => `
              <div class="stat-item">
                <div class="stat-header">
                  <span class="stat-icon">${stat.icon || '📊'}</span>
                  <span class="stat-name">${stat.name}</span>
                </div>
                <div class="stat-description">${stat.description}</div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${(stat.value / stat.max) * 100}%; --progress-color: ${stat.color || '#007AFF'}"></div>
                </div>
                <div class="progress-value">${formatBytes(stat.value)} / ${formatBytes(stat.max)}</div>
              </div>
            `
            )
            .join('')}
        </div>
      `
    } catch (error) {
      console.error('Failed to load stats:', error)
      statsContent.innerHTML = `<div class="error">Failed to load stats: ${error.message}</div>`
    }
  }
}

// Register the custom element
customElements.define(pkg.name, StatsComponent)

// Plugin configuration
/** @type {import('admindo').Plugin} */
const statsPlugin = {
  slug: pkg.name,
  version: pkg.version,
  description: pkg.description,
  title: 'Stats',
  scope: 'instance',
  icon: '📊',
  color: '#FF9500',
  render: () => document.createElement(pkg.name),
}

// Auto-register plugin if AdminDO is available
window.AdminDO?.registerPlugin?.(statsPlugin)

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
