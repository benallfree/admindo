/**
 * AdminDO - Main Entry Point
 * Zero-dependency admin dashboard with pluggable architecture
 */

/**
 * @typedef {Object} Plugin
 * @property {string} name - The unique name of the plugin
 * @property {string} title - The display title of the plugin
 * @property {string} description - A description of what the plugin does
 * @property {string} [slug] - Optional URL slug for the plugin (defaults to name)
 * @property {string} [icon] - Optional icon for the plugin (emoji or HTML)
 * @property {string} [color] - Optional color for the plugin icon background
 * @property {Object} components - Plugin components
 * @property {typeof HTMLElement} components.panel - The main panel component class
 * @property {typeof HTMLElement} components.icon - The icon component class
 */

/**
 * @typedef {Object} RouteState
 * @property {string} path - The current route path
 */

// Version constant
const version = '0.0.1-rc.3'

/**
 * Attaches AdminDO styles to the document head
 * @returns {void}
 */
function attachAdminDOStyles() {
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

/**
 * Returns the AdminDO dashboard HTML template
 * @returns {string} The HTML template string
 */
function getAdminDOTemplate() {
  return `
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

/**
 * Manages view switching and navigation states
 */
class ViewManager {
  /**
   * @param {HTMLElement} container - The container element
   */
  constructor(container) {
    this.container = container
  }

  /**
   * Switch to a different view based on route
   * @param {string} route - The route to switch to
   * @returns {void}
   */
  switchView(route) {
    const viewName = this.normalizeRoute(route)
    this.updateActiveNavigation(viewName)
    this.updateActiveContent(viewName)
  }

  /**
   * Normalize a route to a view name
   * @param {string} route - The route to normalize
   * @returns {string} The normalized view name
   */
  normalizeRoute(route) {
    if (route === '/' || route === '') {
      return 'dashboard'
    }
    return route.startsWith('/') ? route.substring(1) : route
  }

  /**
   * Update active navigation link
   * @param {string} viewName - The view name to activate
   * @returns {void}
   */
  updateActiveNavigation(viewName) {
    this.container.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active')
    })

    const targetNav = this.container.querySelector(`[data-view="${viewName}"]`)
    if (targetNav) {
      targetNav.classList.add('active')
    }
  }

  /**
   * Update active content view
   * @param {string} viewName - The view name to show
   * @returns {void}
   */
  updateActiveContent(viewName) {
    this.container.querySelectorAll('.plugin-content').forEach((content) => {
      content.classList.remove('active')
    })

    const targetView = this.container.querySelector(`#${viewName}-view`)
    if (targetView) {
      targetView.classList.add('active')
    }
  }
}

/**
 * Simple Router for AdminDO
 */
class AdminDORouter {
  /**
   * @param {AdminDOComponent} adminDoComponent - The main component instance
   * @param {string} [root=''] - The root path prefix
   */
  constructor(adminDoComponent, root = '') {
    this.component = adminDoComponent
    /** @type {Map<string, Plugin>} */
    this.routes = new Map()
    /** @type {string|null} */
    this.currentRoute = null
    this.root = root.endsWith('/') ? root.slice(0, -1) : root // Remove trailing slash

    // Listen for browser navigation
    window.addEventListener('popstate', (e) => {
      this.handleRouteChange()
    })
  }

  /**
   * Register a route with a plugin
   * @param {string} path - The route path
   * @param {Plugin} plugin - The plugin configuration
   * @returns {void}
   */
  addRoute(path, plugin) {
    this.routes.set(path, plugin)
  }

  /**
   * Navigate to a route
   * @param {string} path - The path to navigate to
   * @param {boolean} [updateHistory=true] - Whether to update browser history
   * @returns {void}
   */
  navigate(path, updateHistory = true) {
    const fullPath = this.getFullPath(path)
    if (updateHistory) {
      history.pushState({ path: fullPath }, '', fullPath)
    }
    this.currentRoute = path
    this.component.switchView(path)
  }

  /**
   * Handle route changes (back/forward, refresh)
   * @returns {void}
   */
  handleRouteChange() {
    const fullPath = window.location.pathname
    const relativePath = this.getRelativePath(fullPath)
    this.currentRoute = relativePath
    this.component.switchView(relativePath)
  }

  /**
   * Get the current route
   * @returns {string} The current route
   */
  getCurrentRoute() {
    return this.getRelativePath(window.location.pathname)
  }

  /**
   * Initialize router with current URL
   * @returns {void}
   */
  init() {
    this.handleRouteChange()
  }

  /**
   * Convert relative path to full path with root prefix
   * @param {string} path - The relative path
   * @returns {string} The full path
   */
  getFullPath(path) {
    if (!this.root) return path
    if (path === '/') return this.root || '/'
    return `${this.root}${path}`
  }

  /**
   * Convert full path to relative path by removing root prefix
   * @param {string} fullPath - The full path
   * @returns {string} The relative path
   */
  getRelativePath(fullPath) {
    if (!this.root) return fullPath
    if (fullPath === this.root) return '/'
    if (fullPath.startsWith(`${this.root}/`)) {
      return fullPath.substring(this.root.length)
    }
    return fullPath
  }
}

/**
 * Manages plugin registration and UI integration
 */
class PluginManager {
  /**
   * @param {HTMLElement} container - The container element
   * @param {AdminDORouter} router - The router instance
   */
  constructor(container, router) {
    /** @type {Map<string, Plugin>} */
    this.plugins = new Map()
    this.container = container
    this.router = router
  }

  /**
   * Register a new plugin
   * @param {Plugin} plugin - The plugin configuration
   * @returns {void}
   */
  registerPlugin(plugin) {
    this.plugins.set(plugin.name, plugin)

    // Register route for plugin
    const route = `/${plugin.slug || plugin.name}`
    this.router.addRoute(route, plugin)

    this.addPluginToGrid(plugin)
    this.addPluginToNav(plugin)
    this.addPluginView(plugin)
  }

  /**
   * Add plugin tile to the dashboard grid
   * @param {Plugin} plugin - The plugin configuration
   * @returns {void}
   */
  addPluginToGrid(plugin) {
    const grid = this.container.querySelector('#plugin-grid')
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

  /**
   * Add plugin link to the sidebar navigation
   * @param {Plugin} plugin - The plugin configuration
   * @returns {void}
   */
  addPluginToNav(plugin) {
    const nav = this.container.querySelector('#sidebar-nav')
    if (!nav) return

    const li = document.createElement('li')
    const viewName = plugin.slug || plugin.name
    li.innerHTML = `<a href="#" class="nav-link" data-view="${viewName}">${plugin.title}</a>`
    nav.appendChild(li)

    // Add event listener to new nav item
    const newLink = li.querySelector('.nav-link')
    if (newLink) {
      newLink.addEventListener('click', (e) => {
        e.preventDefault()
        const route = `/${plugin.slug || plugin.name}`
        this.router.navigate(route)
      })
    }
  }

  /**
   * Add plugin view container
   * @param {Plugin} plugin - The plugin configuration
   * @returns {void}
   */
  addPluginView(plugin) {
    const pluginViews = this.container.querySelector('#plugin-views')
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
}

/**
 * AdminDO main web component
 */
class AdminDOComponent extends HTMLElement {
  constructor() {
    super()

    // Get root prefix from attribute, defaulting to empty string
    const root = this.getAttribute('root') || ''
    this.router = new AdminDORouter(this, root)
    /** @type {ViewManager|undefined} */
    this.viewManager = undefined
    /** @type {PluginManager|undefined} */
    this.pluginManager = undefined
    this.init()
  }

  /**
   * Initialize the component
   * @returns {Promise<void>}
   */
  async init() {
    // Apply styles
    attachAdminDOStyles()
  }

  /**
   * Called when the element is connected to the DOM
   * @returns {void}
   */
  connectedCallback() {
    this.render()
    this.attachEventListeners()

    // Initialize managers after rendering
    this.viewManager = new ViewManager(this)
    this.pluginManager = new PluginManager(this, this.router)

    // Initialize router after rendering
    setTimeout(() => {
      this.router.init()
    }, 0)
  }

  /**
   * Switch to a different view
   * @param {string} route - The route to switch to
   * @returns {void}
   */
  switchView(route) {
    if (this.viewManager) {
      this.viewManager.switchView(route)
    }
  }

  /**
   * Register a plugin with the component
   * @param {Plugin} plugin - The plugin configuration
   * @returns {void}
   */
  registerPlugin(plugin) {
    if (this.pluginManager) {
      this.pluginManager.registerPlugin(plugin)
    }
  }

  /**
   * Attach event listeners to the component
   * @returns {void}
   */
  attachEventListeners() {
    // Dashboard nav link
    const dashboardLink = this.querySelector('[data-view="dashboard"]')
    if (dashboardLink) {
      dashboardLink.addEventListener('click', (e) => {
        e.preventDefault()
        this.router.navigate('/')
      })
    }
  }

  /**
   * Render the component's HTML
   * @returns {void}
   */
  render() {
    this.innerHTML = getAdminDOTemplate()
  }
}

// Register the component
customElements.define('admin-do', AdminDOComponent)

/**
 * @typedef {Object} AdminDOAPI
 * @property {string} version - The AdminDO version
 * @property {typeof AdminDOComponent} component - The AdminDOComponent class
 * @property {function(string|Element): AdminDOComponent|null} create - Create a new AdminDO instance
 * @property {function(Plugin): boolean} registerPlugin - Register a plugin globally
 */

// Make available globally for non-module usage
/** @type {AdminDOAPI} */
window.AdminDO = {
  version,
  component: AdminDOComponent,

  /**
   * Utility function to create a new AdminDO instance
   * @param {string|Element} targetElement - Target element or selector
   * @returns {AdminDOComponent|null} The created component or null if target not found
   */
  create(targetElement) {
    let element

    if (typeof targetElement === 'string') {
      element = document.querySelector(targetElement)
    } else {
      element = targetElement
    }

    if (!element) {
      console.error('AdminDO: Target element not found')
      return null
    }

    const adminDoElement = document.createElement('admin-do')
    element.appendChild(adminDoElement)
    return adminDoElement
  },

  /**
   * Plugin registration helper
   * @param {Plugin} pluginConfig - The plugin configuration
   * @returns {boolean} True if registered successfully, false otherwise
   */
  registerPlugin(pluginConfig) {
    const adminDoElement = document.querySelector('admin-do')
    if (adminDoElement && typeof adminDoElement.registerPlugin === 'function') {
      adminDoElement.registerPlugin(pluginConfig)
      return true
    } else {
      console.warn('AdminDO: Main component not found. Plugin will be registered when component is available.')
      return false
    }
  },
}

// Export for ES modules (if using module system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminDOComponent
  module.exports.AdminDOComponent = AdminDOComponent
}

// Export for ES6 modules (if using import/export)
if (typeof window !== 'undefined') {
  window.AdminDOComponent = AdminDOComponent
}
