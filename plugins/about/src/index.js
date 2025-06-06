import pkg from '../package.json' with { type: 'json' }
/**
 * AdminDO About Plugin
 * A web component plugin that displays about information
 */

// About main component
class AboutComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()

    // Listen for plugin registration events to update the plugin list
    const adminComponent = document.querySelector('admin-do')
    if (adminComponent) {
      this.handlePluginRegistered = () => {
        this.render()
      }
      adminComponent.addEventListener('plugin-registered', this.handlePluginRegistered)
    }
  }

  disconnectedCallback() {
    // Clean up event listener
    const adminComponent = document.querySelector('admin-do')
    if (adminComponent && this.handlePluginRegistered) {
      adminComponent.removeEventListener('plugin-registered', this.handlePluginRegistered)
    }
  }

  getAllPlugins() {
    // Use the AdminDO global API to get all plugins
    const plugins = window.AdminDO?.getAllPlugins?.() || []

    // Sort plugins by title for consistent display
    return plugins.sort((a, b) => a.title.localeCompare(b.title))
  }

  render() {
    const plugins = this.getAllPlugins()

    const pluginsHtml = plugins
      .map(
        (plugin) => `
      <div class="plugin-item">
        <div class="plugin-icon" style="background: ${plugin.color || '#007AFF'}">
          ${plugin.icon || '📦'}
        </div>
        <div class="plugin-info">
          <div class="plugin-name">${plugin.title}</div>
          <div class="plugin-description">${plugin.description || 'No description available'}</div>
          <div class="plugin-meta">
            <span class="plugin-version">v${plugin.version || '0.0.0'}</span>
            <span class="plugin-scope">${plugin.scope || 'instance'}</span>
          </div>
        </div>
      </div>
    `
      )
      .join('')

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
        }
        
        .about-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e7;
          margin-top: 1rem;
        }
        
        .about-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1d1d1f;
        }
        
        .section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1d1d1f;
        }
        
        .team-member {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .member-avatar {
          width: 48px;
          height: 48px;
          background: #007AFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 1rem;
          font-size: 1.2rem;
        }
        
        .member-info {
          flex: 1;
        }
        
        .member-name {
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 0.25rem;
        }
        
        .member-role {
          color: #6e6e73;
          font-size: 0.9rem;
        }
        
        .description {
          color: #6e6e73;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .plugin-item {
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          margin-bottom: 0.75rem;
          background: #f5f5f7;
          border-radius: 8px;
          border: 1px solid #e5e5e7;
        }
        
        .plugin-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 1rem;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        
        .plugin-info {
          flex: 1;
          min-width: 0;
        }
        
        .plugin-name {
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        
        .plugin-description {
          color: #6e6e73;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        
        .plugin-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
        }
        
        .plugin-version {
          color: #007AFF;
          font-weight: 500;
        }
        
        .plugin-scope {
          color: #6e6e73;
          background: white;
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          border: 1px solid #e5e5e7;
        }
        
        .plugins-empty {
          text-align: center;
          color: #6e6e73;
          font-style: italic;
          padding: 2rem;
        }
      </style>
      
      <div class="about-container">
        <h2 class="about-header">About AdminDO</h2>
        
        <div class="section">
          <div class="description">
            <p>AdminDO is a zero-dependency admin dashboard built with pure HTML, CSS, and JavaScript.</p>
            <p>Features web components and a pluggable architecture for maximum flexibility and extensibility.</p>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Installed Plugins (${plugins.length})</h3>
          ${plugins.length > 0 ? pluginsHtml : '<div class="plugins-empty">No plugins installed</div>'}
        </div>
        
        <div class="section">
          <h3 class="section-title">Contributors</h3>
          
          <div class="team-member">
            <div class="member-avatar">👤</div>
            <div class="member-info">
              <div class="member-name">@janwilmake</div>
              <div class="member-role">Contributor • <a href="https://x.com/janwilmake" target="_blank" style="color: #007AFF; text-decoration: none;">x.com/janwilmake</a></div>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">⚡</div>
            <div class="member-info">
              <div class="member-name">@flowisgreat</div>
              <div class="member-role">Contributor • <a href="https://x.com/flowisgreat" target="_blank" style="color: #007AFF; text-decoration: none;">x.com/flowisgreat</a></div>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">🚀</div>
            <div class="member-info">
              <div class="member-name">@benallfree</div>
              <div class="member-role">Contributor • <a href="https://x.com/benallfree" target="_blank" style="color: #007AFF; text-decoration: none;">x.com/benallfree</a></div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

// Register the custom element
customElements.define(pkg.name, AboutComponent)

// Plugin configuration
/** @type {import('admindo').Plugin} */
const aboutPlugin = {
  slug: pkg.name,
  version: pkg.version,
  description: pkg.description,
  title: 'About',
  scope: 'global',
  icon: '👥',
  color: '#34C759',
  render: () => document.createElement(pkg.name),
}

// Auto-register plugin if AdminDO is available
window.AdminDO?.registerPlugin?.(aboutPlugin)
