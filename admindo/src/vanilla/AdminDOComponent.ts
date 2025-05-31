import { AdminDORouter } from './AdminDORouter'
import { PluginConfig } from './types'

// AdminDO main component
export class AdminDOComponent extends HTMLElement {
  private plugins: Map<string, PluginConfig>
  private router: AdminDORouter

  constructor() {
    super()
    this.plugins = new Map()
    this.router = new AdminDORouter(this)
    this.init()
  }

  async init(): Promise<void> {
    // Apply styles
    this.attachStylesheet()
  }

  connectedCallback(): void {
    this.render()
    this.attachEventListeners()

    // Initialize router after rendering
    setTimeout(() => {
      this.router.init()
    }, 0)
  }

  switchView(route: string): void {
    // Handle different route formats
    let viewName: string
    if (route === '/' || route === '') {
      viewName = 'dashboard'
    } else {
      // Remove leading slash and use as view name
      viewName = route.startsWith('/') ? route.substring(1) : route
    }

    // Update active nav
    this.querySelectorAll('.nav-link').forEach((link: Element) => {
      link.classList.remove('active')
    })

    const targetNav = this.querySelector(`[data-view="${viewName}"]`)
    if (targetNav) {
      targetNav.classList.add('active')
    }

    // Update active content
    this.querySelectorAll('.plugin-content').forEach((content: Element) => {
      content.classList.remove('active')
    })

    const targetView = this.querySelector(`#${viewName}-view`)
    if (targetView) {
      targetView.classList.add('active')
    }
  }

  registerPlugin(plugin: PluginConfig): void {
    this.plugins.set(plugin.name, plugin)

    // Register route for plugin
    const route = `/${plugin.slug || plugin.name}`
    this.router.addRoute(route, plugin)

    this.addPluginToGrid(plugin)
    this.addPluginToNav(plugin)
    this.addPluginView(plugin)
  }

  private addPluginToGrid(plugin: PluginConfig): void {
    const grid = this.querySelector('#plugin-grid')
    if (!grid) return

    const tile = document.createElement('div')
    tile.className = 'plugin-tile'
    tile.innerHTML = `
      <div class="plugin-icon" style="background: ${plugin.color || '#007AFF'}">
          ${plugin.icon || '📦'}
      </div>
      <div class="plugin-title">${plugin.title}</div>
      <div class="plugin-description">${plugin.description}</div>
    `

    // Use router for navigation
    tile.addEventListener('click', () => {
      const route = `/${plugin.slug || plugin.name}`
      this.router.navigate(route)
    })

    grid.appendChild(tile)
  }

  private addPluginToNav(plugin: PluginConfig): void {
    const nav = this.querySelector('#sidebar-nav')
    if (!nav) return

    const li = document.createElement('li')
    const viewName = plugin.slug || plugin.name
    li.innerHTML = `<a href="#" class="nav-link" data-view="${viewName}">${plugin.title}</a>`
    nav.appendChild(li)

    // Add event listener to new nav item
    const newLink = li.querySelector('.nav-link')
    if (newLink) {
      newLink.addEventListener('click', (e: Event) => {
        e.preventDefault()
        const route = `/${plugin.slug || plugin.name}`
        this.router.navigate(route)
      })
    }
  }

  private addPluginView(plugin: PluginConfig): void {
    const pluginViews = this.querySelector('#plugin-views')
    if (!pluginViews) return

    const view = document.createElement('div')
    const viewName = plugin.slug || plugin.name
    view.id = `${viewName}-view`
    view.className = 'plugin-content'

    // Use standardized naming: all plugins have a 'panel' component
    const componentName = `admindo-plugin-${plugin.name}`
    view.innerHTML = `<${componentName}></${componentName}>`
    pluginViews.appendChild(view)
  }

  private attachEventListeners(): void {
    // Dashboard nav link
    const dashboardLink = this.querySelector('[data-view="dashboard"]')
    if (dashboardLink) {
      dashboardLink.addEventListener('click', (e: Event) => {
        e.preventDefault()
        this.router.navigate('/')
      })
    }
  }

  private attachStylesheet(): void {
    if (!document.getElementById('admindo-styles')) {
      const style = document.createElement('style')
      style.id = 'admindo-styles'
      style.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f7;
          color: #1d1d1f;
        }
        
        .admin-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e5e7;
          padding: 1.5rem 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .admin-header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .admin-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        
        .admin-logo svg {
          width: 128px;
          height: 128px;
        }
        
        .admin-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
        }
        
        .admin-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: calc(100vh - 80px);
        }
        
        .admin-sidebar {
          background: #ffffff;
          border-right: 1px solid #e5e5e7;
          padding: 2rem 1rem;
        }
        
        .admin-content {
          padding: 2rem;
        }
        
        .plugin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .plugin-tile {
          background: #ffffff;
          border: 1px solid #e5e5e7;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        
        .plugin-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .plugin-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .plugin-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .plugin-description {
          color: #6e6e73;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .sidebar-nav {
          list-style: none;
        }
        
        .sidebar-nav li {
          margin-bottom: 0.5rem;
        }
        
        .sidebar-nav a {
          display: block;
          padding: 0.75rem 1rem;
          color: #6e6e73;
          text-decoration: none;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }
        
        .sidebar-nav a:hover,
        .sidebar-nav a.active {
          background: #f5f5f7;
          color: #1d1d1f;
        }
        
        .plugin-content {
          display: none;
        }
        
        .plugin-content.active {
          display: block;
        }
      `
      document.head.appendChild(style)
    }
  }

  private render(): void {
    this.innerHTML = `
      <div class="admin-header">
          <div class="admin-header-content">
              <div class="admin-logo">
                  <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160">
                      <defs>
                          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style="stop-color:#ea6b17;stop-opacity:1" />
                              <stop offset="100%" style="stop-color:#d06f23;stop-opacity:1" />
                          </linearGradient>
                      </defs>
                      <g transform="translate(30, 30) scale(4.8)">
                          <path d="M60,30 A20,20 0 0,0 40,10 A15,15 0 0,0 25,15 A10,10 0 0,0 15,10 A10,10 0 0,0 5,20 A15,15 0 0,0 0,30 H60 Z" fill="url(#cloudGradient)" />
                      </g>
                      <g transform="translate(120, 10) scale(1.78)">
                          <g transform="translate(-40, 20) scale(2)">
                              <circle cx="40" cy="25" r="8" fill="#d8e4e4" opacity="0.8" />
                              <path d="M40,21 V29 M36,25 H44 M37.2,21.8 L42.8,28.2 M37.2,28.2 L42.8,21.8" stroke="#2F80ED" stroke-width="1.5" />
                          </g>
                          <g transform="translate(0, 0) scale(1)">
                              <text x="0" y="85" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#d8e4e4">D</text>
                          </g>
                      </g>
                  </svg>
              </div>
              <h1 class="admin-title">AdminDO Dashboard</h1>
          </div>
      </div>
      <div class="admin-container">
          <aside class="admin-sidebar">
              <nav>
                  <ul class="sidebar-nav" id="sidebar-nav">
                      <li><a href="#" class="nav-link active" data-view="dashboard">Dashboard</a></li>
                  </ul>
              </nav>
          </aside>
          <main class="admin-content">
              <div id="dashboard-view" class="plugin-content active">
                  <h2>Welcome to AdminDO</h2>
                  <p>A zero-dependency admin dashboard with pluggable architecture.</p>
                  <div class="plugin-grid" id="plugin-grid">
                  </div>
              </div>
              <div id="plugin-views"></div>
          </main>
      </div>
    `
  }
}
// Register the component
customElements.define('admin-do', AdminDOComponent)
// AdminDO API interface
interface AdminDOAPI {
  version: string
  component: typeof AdminDOComponent
  create(targetElement: string | Element): AdminDOComponent | null
  registerPlugin(pluginConfig: PluginConfig): boolean
}
// Export for ES modules
export default AdminDOComponent
export type { AdminDOAPI, PluginConfig }
// Make available globally for non-module usage

declare global {
  interface Window {
    AdminDO: AdminDOAPI
  }
}
window.AdminDO = {
  version: '1.0.0',
  component: AdminDOComponent,

  // Utility function to create a new AdminDO instance
  create(targetElement: string | Element): AdminDOComponent | null {
    let element: Element | null

    if (typeof targetElement === 'string') {
      element = document.querySelector(targetElement)
    } else {
      element = targetElement
    }

    if (!element) {
      console.error('AdminDO: Target element not found')
      return null
    }

    const adminDoElement = document.createElement('admin-do') as AdminDOComponent
    element.appendChild(adminDoElement)
    return adminDoElement
  },

  // Plugin registration helper
  registerPlugin(pluginConfig: PluginConfig): boolean {
    const adminDoElement = document.querySelector('admin-do') as AdminDOComponent
    if (adminDoElement && typeof adminDoElement.registerPlugin === 'function') {
      adminDoElement.registerPlugin(pluginConfig)
      return true
    } else {
      console.warn('AdminDO: Main component not found. Plugin will be registered when component is available.')
      return false
    }
  },
}
