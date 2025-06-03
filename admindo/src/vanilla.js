/**
 * AdminDO - Main Entry Point
 * Zero-dependency admin dashboard with pluggable architecture
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
    this.plugins.set(plugin.slug, plugin)

    // Register route for plugin
    const route = `/${plugin.slug}`
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
      const route = `/${plugin.slug}`
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
    const viewName = plugin.slug
    li.innerHTML = `<a href="#" class="nav-link" data-view="${viewName}">${plugin.title}</a>`
    nav.appendChild(li)

    // Add event listener to new nav item
    const newLink = li.querySelector('.nav-link')
    if (newLink) {
      newLink.addEventListener('click', (e) => {
        e.preventDefault()
        const route = `/${plugin.slug}`
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
    const viewName = plugin.slug
    view.id = `${viewName}-view`
    view.className = 'plugin-content'

    // Directly instantiate the plugin render component
    const componentInstance = new plugin.render()
    view.appendChild(componentInstance)
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
    this.root = root.endsWith('/') ? root.slice(0, -1) : root // Remove trailing slash

    // Get demo credentials from attribute if demo mode is enabled
    const demoAttr = this.getAttribute('demo')
    this.demoCredentials = null
    if (demoAttr) {
      try {
        this.demoCredentials = JSON.parse(demoAttr)
      } catch (error) {
        console.warn('AdminDO: Invalid demo attribute format', error)
      }
    }

    this.router = new AdminDORouter(this, root)
    /** @type {ViewManager|undefined} */
    this.viewManager = undefined
    /** @type {PluginManager|undefined} */
    this.pluginManager = undefined
    /** @type {boolean} */
    this.isAuthenticated = false
    /** @type {Plugin[]} */
    this.pendingPlugins = []
    this.init()
  }

  /**
   * Get the full API URL with root prefix for AdminDO core APIs
   * @param {string} path - The API path
   * @returns {string} The full URL
   */
  getApiUrl(path) {
    const apiPath = path.startsWith('/') ? path : `/${path}`
    return `${this.root}/api${apiPath}`
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
   * Check authentication status
   * @returns {Promise<boolean>} Whether the user is authenticated
   */
  async checkAuthStatus() {
    const token = localStorage.getItem('admindo-auth-token')
    if (!token) {
      return false
    }

    try {
      const response = await fetch(this.getApiUrl('/admindo/auth/status'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.authenticated === true
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }

    return false
  }

  /**
   * Handle login
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<{success: boolean, message?: string}>} Login result
   */
  async handleLogin(username, password) {
    try {
      const response = await fetch(this.getApiUrl('/admindo/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('admindo-auth-token', data.token)
        this.isAuthenticated = true
        this.render()
        this.initializeDashboard()
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' }
    }
  }

  /**
   * Handle logout
   * @returns {void}
   */
  handleLogout() {
    localStorage.removeItem('admindo-auth-token')
    this.isAuthenticated = false
    this.render()
  }

  /**
   * Initialize dashboard after authentication
   * @returns {void}
   */
  initializeDashboard() {
    this.attachEventListeners()

    // Initialize managers after rendering
    this.viewManager = new ViewManager(this)
    this.pluginManager = new PluginManager(this, this.router)

    // Register any pending plugins that were waiting for authentication
    for (const plugin of this.pendingPlugins) {
      this.pluginManager.registerPlugin(plugin)
    }
    this.pendingPlugins = []

    // Initialize router after rendering
    setTimeout(() => {
      this.router.init()
    }, 0)
  }

  /**
   * Called when the element is connected to the DOM
   * @returns {void}
   */
  async connectedCallback() {
    this.isAuthenticated = await this.checkAuthStatus()
    this.render()

    if (this.isAuthenticated) {
      this.initializeDashboard()
    }
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
      // Component is ready, register immediately
      this.pluginManager.registerPlugin(plugin)
    } else {
      // Component not ready yet, store for later
      this.pendingPlugins.push(plugin)
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
   * Render the login screen
   * @returns {string} Login screen HTML
   */
  renderLoginScreen() {
    const demoSection = this.demoCredentials
      ? `
      <div class="demo-section">
        <div class="demo-badge">DEMO MODE</div>
        <div class="demo-credentials">
          <div class="demo-label">Demo Credentials:</div>
          <div class="demo-creds">
            <strong>Username:</strong> ${this.demoCredentials.username}<br>
            <strong>Password:</strong> ${this.demoCredentials.password}
          </div>
        </div>
      </div>
    `
      : ''

    return `
      <style>
        .login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f5f5f7;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .login-container {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e5e7;
          min-width: 400px;
          text-align: center;
        }
        
        .demo-section {
          background: #e3f2fd;
          border: 1px solid #2196f3;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .demo-badge {
          background: #2196f3;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .demo-label {
          font-weight: 600;
          color: #1976d2;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .demo-creds {
          font-family: monospace;
          background: #f8f9fa;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          line-height: 1.4;
          color: #333;
        }
        
        .logo {
          margin-bottom: 2rem;
        }
        
        .logo svg {
          width: 80px;
          height: 80px;
        }
        
        .login-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .login-subtitle {
          color: #6e6e73;
          margin-bottom: 2rem;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .form-group {
          text-align: left;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #1d1d1f;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e5e7;
          border-radius: 6px;
          font-size: 0.9rem;
          box-sizing: border-box;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #007AFF;
        }
        
        .login-btn {
          background: #007AFF;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          margin-top: 1rem;
        }
        
        .login-btn:hover {
          background: #0056b3;
        }
        
        .login-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          display: none;
        }
      </style>
      
      <div class="login-overlay">
        <div class="login-container">
          ${demoSection}
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160">
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
              </g>
            </svg>
          </div>
          
          <h1 class="login-title">AdminDO Dashboard</h1>
          <p class="login-subtitle">Please log in to continue</p>
          
          <form class="login-form" id="loginForm">
            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <input class="form-input" type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input class="form-input" type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="login-btn" id="loginBtn">Login</button>
            <div class="error-message" id="errorMessage"></div>
          </form>
        </div>
      </div>
    `
  }

  /**
   * Render the component's HTML
   * @returns {void}
   */
  render() {
    if (!this.isAuthenticated) {
      this.innerHTML = this.renderLoginScreen()

      // Setup login form handler
      setTimeout(() => {
        const loginForm = this.querySelector('#loginForm')
        if (loginForm) {
          // Pre-fill demo credentials if demo mode is enabled
          if (this.demoCredentials) {
            const usernameField = this.querySelector('#username')
            const passwordField = this.querySelector('#password')
            if (usernameField) usernameField.value = this.demoCredentials.username
            if (passwordField) passwordField.value = this.demoCredentials.password
          }

          loginForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const loginBtn = this.querySelector('#loginBtn')
            const errorMessage = this.querySelector('#errorMessage')
            const username = this.querySelector('#username').value
            const password = this.querySelector('#password').value

            if (loginBtn && errorMessage) {
              loginBtn.disabled = true
              loginBtn.textContent = 'Logging in...'
              errorMessage.style.display = 'none'

              const result = await this.handleLogin(username, password)

              if (!result.success) {
                errorMessage.textContent = result.message || 'Login failed'
                errorMessage.style.display = 'block'
                loginBtn.disabled = false
                loginBtn.textContent = 'Login'
              }
            }
          })
        }
      }, 0)
    } else {
      this.innerHTML = getAdminDOTemplate()
    }
  }
}

// Register the component
customElements.define('admin-do', AdminDOComponent)

// Make available globally for non-module usage
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

  /**
   * Fetch helper that automatically uses the correct root prefix and API structure
   * @param {string} path - API path (e.g., '/admindo/auth/login' or '/pluginname/endpoint')
   * @param {RequestInit} [options] - Fetch options
   * @returns {Promise<Response>} Fetch promise
   */
  fetch(path, options = {}) {
    const adminDoElement = document.querySelector('admin-do')
    let apiUrl

    if (adminDoElement && adminDoElement.root !== undefined) {
      // Use the main component's root prefix
      const root = adminDoElement.root || ''
      const apiPath = path.startsWith('/') ? path : `/${path}`
      apiUrl = `${root}/api${apiPath}`
    } else {
      // Fallback if main component not found
      const apiPath = path.startsWith('/') ? path : `/${path}`
      apiUrl = `/api${apiPath}`
    }

    // Automatically add auth token if available
    const token = localStorage.getItem('admindo-auth-token')
    if (token && !options.headers?.Authorization && !options.headers?.authorization) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    return fetch(apiUrl, options)
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
