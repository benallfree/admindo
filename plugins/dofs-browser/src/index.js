import pkg from '../package.json' with { type: 'json' }
/**
 * AdminDO DOFS Browser Plugin
 * A web component plugin that provides a Durable Objects File System GUI
 */

// DOFS Browser main component
class DofsBrowserComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
        }
        
        .dofs-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e7;
          margin-top: 1rem;
        }
        
        .dofs-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1d1d1f;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .toolbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f5f5f7;
          border-radius: 8px;
        }
        
        .btn {
          background: #007AFF;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .btn:hover {
          background: #0056b3;
        }
        
        .btn-secondary {
          background: #6e6e73;
        }
        
        .btn-secondary:hover {
          background: #515154;
        }
        
        .path-display {
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid #e5e5e7;
          font-family: monospace;
          flex: 1;
        }
        
        .file-list {
          border: 1px solid #e5e5e7;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .file-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f5f5f7;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .file-item:hover {
          background: #f5f5f7;
        }
        
        .file-item:last-child {
          border-bottom: none;
        }
        
        .file-icon {
          margin-right: 0.75rem;
          font-size: 1.2rem;
        }
        
        .file-info {
          flex: 1;
        }
        
        .file-name {
          font-weight: 500;
          color: #1d1d1f;
        }
        
        .file-meta {
          font-size: 0.8rem;
          color: #6e6e73;
          margin-top: 0.25rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6e6e73;
        }
      </style>
      
      <div class="dofs-container">
        <h2 class="dofs-header">
          📁 File System Browser
        </h2>
        
        <div class="toolbar">
          <button class="btn">📁 New Folder</button>
          <button class="btn">📄 New File</button>
          <button class="btn btn-secondary">🔄 Refresh</button>
          <div class="path-display">/</div>
        </div>
        
        <div class="file-list">
          <div class="file-item">
            <div class="file-icon">📁</div>
            <div class="file-info">
              <div class="file-name">data</div>
              <div class="file-meta">Directory • Modified 2 hours ago</div>
            </div>
          </div>
          
          <div class="file-item">
            <div class="file-icon">📁</div>
            <div class="file-info">
              <div class="file-name">logs</div>
              <div class="file-meta">Directory • Modified 1 day ago</div>
            </div>
          </div>
          
          <div class="file-item">
            <div class="file-icon">📄</div>
            <div class="file-info">
              <div class="file-name">config.json</div>
              <div class="file-meta">File • 1.2 KB • Modified 3 hours ago</div>
            </div>
          </div>
          
          <div class="file-item">
            <div class="file-icon">📄</div>
            <div class="file-info">
              <div class="file-name">README.md</div>
              <div class="file-meta">File • 856 B • Modified 1 week ago</div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

// Register the custom element
customElements.define('admindo-dofs-browser', DofsBrowserComponent)

// Plugin configuration
const dofsBrowserPlugin = {
  slug: pkg.name,
  title: 'File Browser',
  description: pkg.description,
  version: pkg.version,
  icon: '📁',
  color: '#FF9500',
  render: () => document.createElement('admindo-dofs-browser'),
}

// Auto-register plugin if AdminDO is available
window.AdminDO?.registerPlugin?.(dofsBrowserPlugin)
