import pkg from '../package.json' with { type: 'json' }
/**
 * AdminDO DORM Plugin
 * A web component plugin that provides a Durable Objects ORM interface
 */

// DORM main component
class DormComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.selectedTable = null
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  setupEventListeners() {
    const refreshBtn = this.shadowRoot.querySelector('.refresh-btn')
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshData())
    }

    const tableItems = this.shadowRoot.querySelectorAll('.table-item')
    tableItems.forEach((item) => {
      item.addEventListener('click', () => {
        this.selectedTable = item.dataset.table
        this.updateTableView()
      })
    })
  }

  refreshData() {
    // Simulate data refresh
    const status = this.shadowRoot.querySelector('.status-text')
    if (status) {
      status.textContent = 'Refreshing...'
      setTimeout(() => {
        status.textContent = 'Connected to Durable Object'
      }, 1000)
    }
  }

  updateTableView() {
    const tableView = this.shadowRoot.querySelector('.table-view')
    if (tableView && this.selectedTable) {
      tableView.innerHTML = `
        <div class="table-header">
          <h3>Table: ${this.selectedTable}</h3>
          <div class="table-actions">
            <button class="btn btn-small">Add Record</button>
            <button class="btn btn-small btn-secondary">Export</button>
          </div>
        </div>
        <div class="data-grid">
          <div class="grid-header">
            <div class="grid-cell">ID</div>
            <div class="grid-cell">Name</div>
            <div class="grid-cell">Created</div>
            <div class="grid-cell">Actions</div>
          </div>
          <div class="grid-row">
            <div class="grid-cell">1</div>
            <div class="grid-cell">Sample Record</div>
            <div class="grid-cell">2024-01-15</div>
            <div class="grid-cell">
              <button class="btn-icon">✏️</button>
              <button class="btn-icon">🗑️</button>
            </div>
          </div>
          <div class="grid-row">
            <div class="grid-cell">2</div>
            <div class="grid-cell">Another Record</div>
            <div class="grid-cell">2024-01-14</div>
            <div class="grid-cell">
              <button class="btn-icon">✏️</button>
              <button class="btn-icon">🗑️</button>
            </div>
          </div>
        </div>
      `
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
        }
        
        .dorm-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e7;
          margin-top: 1rem;
        }
        
        .dorm-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1d1d1f;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: #34C759;
          border-radius: 50%;
        }
        
        .status-text {
          color: #6e6e73;
        }
        
        .main-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          min-height: 400px;
        }
        
        .sidebar {
          background: #f5f5f7;
          padding: 1rem;
          border-radius: 8px;
        }
        
        .sidebar-title {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1d1d1f;
        }
        
        .table-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .table-item {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid #e5e5e7;
        }
        
        .table-item:hover {
          background: #007AFF;
          color: white;
          border-color: #007AFF;
        }
        
        .table-view {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6e6e73;
        }
        
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e5e7;
        }
        
        .table-actions {
          display: flex;
          gap: 0.5rem;
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
        
        .btn-small {
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
        }
        
        .btn-secondary {
          background: #6e6e73;
        }
        
        .btn:hover {
          opacity: 0.8;
        }
        
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
        }
        
        .btn-icon:hover {
          background: #f5f5f7;
        }
        
        .refresh-btn {
          background: #34C759;
        }
        
        .data-grid {
          background: white;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e5e5e7;
        }
        
        .grid-header {
          display: grid;
          grid-template-columns: 80px 1fr 120px 100px;
          background: #f5f5f7;
          font-weight: 600;
        }
        
        .grid-row {
          display: grid;
          grid-template-columns: 80px 1fr 120px 100px;
          border-bottom: 1px solid #f5f5f7;
        }
        
        .grid-row:last-child {
          border-bottom: none;
        }
        
        .grid-cell {
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .empty-state {
          text-align: center;
          color: #6e6e73;
        }
      </style>
      
      <div class="dorm-container">
        <div class="dorm-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            🗃️ DORM - Durable Objects ORM
          </div>
          <div class="header-controls">
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span class="status-text">Connected to Durable Object</span>
            </div>
            <button class="btn refresh-btn">🔄 Refresh</button>
          </div>
        </div>
        
        <div class="main-content">
          <div class="sidebar">
            <h3 class="sidebar-title">Tables</h3>
            <ul class="table-list">
              <li class="table-item" data-table="users">👥 Users</li>
              <li class="table-item" data-table="sessions">🔐 Sessions</li>
              <li class="table-item" data-table="logs">📋 Logs</li>
              <li class="table-item" data-table="config">⚙️ Config</li>
            </ul>
          </div>
          
          <div class="table-view">
            <div class="empty-state">
              <h3>Select a table to view data</h3>
              <p>Choose a table from the sidebar to view and manage records</p>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

// Register the custom element
customElements.define(pkg.name, DormComponent)

// Plugin configuration
const dormPlugin = {
  slug: pkg.name,
  title: 'ORM',
  description: pkg.description,
  version: pkg.version,
  icon: '🗃️',
  color: '#5856D6',
  render: () => document.createElement(pkg.name),
}

// Auto-register plugin if AdminDO is available
window.AdminDO?.registerPlugin?.(dormPlugin)
