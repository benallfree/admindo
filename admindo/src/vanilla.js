/**
 * AdminDO - Main Entry Point
 * Zero-dependency admin dashboard with pluggable architecture
 */

// Version constant
import pkg from '../package.json' with { type: 'json' }
const { version } = pkg

// AdminDO theme configuration
const THEME = {
  colors: {
    primary: '#007AFF',
    primaryHover: '#0056b3',
    text: '#1d1d1f',
    textSecondary: '#6e6e73',
    background: '#f5f5f7',
    surface: '#ffffff',
    border: '#e5e5e7',
    borderHover: '#d0d0d0',
    error: '#dc3545',
    demoBlue: '#2196f3',
    demoBlueDark: '#1976d2',
    demoBlueLight: '#e3f2fd',
    fallbackBg: '#f8f9fa',
  },
  styles: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: {
      small: '6px',
      medium: '8px',
      large: '12px',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    shadows: {
      small: '0 1px 3px rgba(0,0,0,0.1)',
      medium: '0 2px 8px rgba(0,0,0,0.04)',
      large: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
}

// AdminDO constants
const AUTH_TOKEN_KEY = 'admindo-auth-token'

// AdminDO logo using import.meta.url
const logoUrl = new URL('./logo.svg', import.meta.url)
const ADMINDO_LOGO_SVG = `<img src="${logoUrl}" alt="AdminDO Logo">`

// AdminDO CSS styles
const ADMINDO_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${THEME.styles.fontFamily};
    background: ${THEME.colors.background};
    color: ${THEME.colors.text};
  }
  
  .admin-header {
    background: ${THEME.colors.surface};
    border-bottom: 1px solid ${THEME.colors.border};
    padding: ${THEME.styles.spacing.lg} ${THEME.styles.spacing.xl};
    box-shadow: ${THEME.styles.shadows.small};
  }
  
  .admin-header-content {
    display: flex;
    align-items: center;
    gap: ${THEME.styles.spacing.md};
  }
  
  .admin-logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  .admin-logo img {
    width: 128px;
    height: 128px;
  }
  
  .admin-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${THEME.colors.text};
    margin: 0;
  }
  
  .admin-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: calc(100vh - 80px);
  }
  
  .admin-sidebar {
    background: ${THEME.colors.surface};
    border-right: 1px solid ${THEME.colors.border};
    padding: ${THEME.styles.spacing.xl} ${THEME.styles.spacing.md};
  }
  
  .admin-content {
    padding: ${THEME.styles.spacing.xl};
  }
  
  .plugin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${THEME.styles.spacing.lg};
    margin-top: ${THEME.styles.spacing.xl};
  }
  
  .plugin-tile {
    background: ${THEME.colors.surface};
    border: 1px solid ${THEME.colors.border};
    border-radius: ${THEME.styles.borderRadius.large};
    padding: ${THEME.styles.spacing.lg};
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: ${THEME.styles.shadows.medium};
  }
  
  .plugin-tile:hover {
    transform: translateY(-2px);
    box-shadow: ${THEME.styles.shadows.large};
  }
  
  .plugin-icon {
    width: 48px;
    height: 48px;
    margin-bottom: ${THEME.styles.spacing.md};
    border-radius: ${THEME.styles.borderRadius.medium};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
  
  .plugin-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: ${THEME.styles.spacing.sm};
  }
  
  .plugin-description {
    color: ${THEME.colors.textSecondary};
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .sidebar-nav {
    list-style: none;
  }
  
  .sidebar-nav li {
    margin-bottom: ${THEME.styles.spacing.sm};
  }
  
  .sidebar-nav a {
    display: block;
    padding: ${THEME.styles.spacing.sm} ${THEME.styles.spacing.md};
    color: ${THEME.colors.textSecondary};
    text-decoration: none;
    border-radius: ${THEME.styles.borderRadius.medium};
    transition: background-color 0.2s ease;
  }
  
  .sidebar-nav a:hover,
  .sidebar-nav a.active {
    background: ${THEME.colors.background};
    color: ${THEME.colors.text};
  }
  
  .plugin-content {
    display: none;
  }
  
  .plugin-content.active {
    display: block;
  }
  
  .dos-section {
    /* margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${THEME.colors.border}; */
  }
  
  .dos-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${THEME.colors.text};
    margin-bottom: ${THEME.styles.spacing.md};
    padding: 0 ${THEME.styles.spacing.md};
  }
  
  .dos-item {
    margin-bottom: ${THEME.styles.spacing.sm};
  }
  
  .dos-namespace {
    display: block;
    padding: ${THEME.styles.spacing.sm} ${THEME.styles.spacing.md};
    color: ${THEME.colors.text};
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: ${THEME.styles.borderRadius.small};
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .dos-namespace:hover {
    background: ${THEME.colors.background};
  }
  
  .dos-instances {
    margin-left: ${THEME.styles.spacing.md};
    margin-top: ${THEME.styles.spacing.xs};
  }
  
  .dos-instance {
    display: block;
    padding: ${THEME.styles.spacing.sm} ${THEME.styles.spacing.md};
    color: ${THEME.colors.textSecondary};
    text-decoration: none;
    font-size: 0.85rem;
    border-radius: ${THEME.styles.borderRadius.small};
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .dos-instance:hover,
  .dos-instance.active {
    background: ${THEME.colors.primary};
    color: white;
  }
  
  .instance-header {
    margin-bottom: ${THEME.styles.spacing.xl};
  }
  
  #instance-title {
    margin-bottom: ${THEME.styles.spacing.lg};
  }
  
  .plugin-tabs {
    display: flex;
    gap: ${THEME.styles.spacing.sm};
    border-bottom: 1px solid ${THEME.colors.border};
    padding-bottom: ${THEME.styles.spacing.sm};
  }
  
  .plugin-tab {
    display: flex;
    align-items: center;
    gap: ${THEME.styles.spacing.sm};
    padding: ${THEME.styles.spacing.sm} ${THEME.styles.spacing.md};
    background: ${THEME.colors.background};
    border: 1px solid ${THEME.colors.border};
    border-radius: ${THEME.styles.borderRadius.medium};
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    color: ${THEME.colors.textSecondary};
    font-size: 0.9rem;
  }
  
  .plugin-tab:hover {
    background: ${THEME.colors.border};
  }
  
  .plugin-tab.active {
    background: ${THEME.colors.primary};
    color: white;
    border-color: ${THEME.colors.primary};
  }
  
  .plugin-tab-icon {
    font-size: 1.2rem;
  }
  
  .instance-content {
    margin-top: ${THEME.styles.spacing.xl};
  }
  
  .dos-loading,
  .dos-empty {
    padding: ${THEME.styles.spacing.md};
    text-align: center;
    color: ${THEME.colors.textSecondary};
    font-size: 0.85rem;
  }
  
  .dos-loading {
    font-style: italic;
  }
  
  .dos-empty {
    opacity: 0.7;
  }
  
  .global-plugins-section {
    margin-top: ${THEME.styles.spacing.xl};
    padding-top: ${THEME.styles.spacing.lg};
    border-top: 1px solid ${THEME.colors.border};
  }
  
  .global-plugins-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${THEME.colors.text};
    margin-bottom: ${THEME.styles.spacing.md};
    padding: 0 ${THEME.styles.spacing.md};
  }
  
  .global-plugins-nav {
    list-style: none;
  }
  
  .global-plugins-nav li {
    margin-bottom: ${THEME.styles.spacing.sm};
  }
  
  .global-plugins-nav a {
    display: block;
    padding: ${THEME.styles.spacing.sm} ${THEME.styles.spacing.md};
    color: ${THEME.colors.textSecondary};
    text-decoration: none;
    border-radius: ${THEME.styles.borderRadius.medium};
    transition: background-color 0.2s ease;
  }
  
  .global-plugins-nav a:hover,
  .global-plugins-nav a.active {
    background: ${THEME.colors.background};
    color: ${THEME.colors.text};
  }
`

/**
 * Attaches AdminDO styles to the document head
 * @returns {void}
 */
function attachAdminDOStyles() {
  if (!document.getElementById('admindo-styles')) {
    const style = document.createElement('style')
    style.id = 'admindo-styles'
    style.textContent = ADMINDO_STYLES
    document.head.appendChild(style)
  }
}

// AdminDO login screen CSS styles
const LOGIN_STYLES = `
  .login-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${THEME.colors.background};
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .login-container {
    background: ${THEME.colors.surface};
    padding: ${THEME.styles.spacing.xl};
    border-radius: ${THEME.styles.borderRadius.large};
    box-shadow: ${THEME.styles.shadows.large};
    border: 1px solid ${THEME.colors.border};
    min-width: 400px;
    text-align: center;
  }
  
  .demo-section {
    background: ${THEME.colors.demoBlueLight};
    border: 1px solid ${THEME.colors.demoBlue};
    border-radius: ${THEME.styles.borderRadius.medium};
    padding: ${THEME.styles.spacing.md};
    margin-bottom: ${THEME.styles.spacing.xl};
    text-align: center;
  }
  
  .demo-badge {
    background: ${THEME.colors.demoBlue};
    color: white;
    padding: ${THEME.styles.spacing.xs} ${THEME.styles.spacing.sm};
    border-radius: ${THEME.styles.borderRadius.medium};
    font-size: 0.7rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: ${THEME.styles.spacing.sm};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .demo-label {
    font-weight: 600;
    color: ${THEME.colors.demoBlueDark};
    margin-bottom: ${THEME.styles.spacing.sm};
    font-size: 0.9rem;
  }
  
  .demo-creds {
    font-family: monospace;
    background: ${THEME.colors.fallbackBg};
    padding: ${THEME.styles.spacing.sm};
    border-radius: ${THEME.styles.borderRadius.small};
    font-size: 0.85rem;
    line-height: 1.4;
    color: #333;
  }
  
  .logo {
    margin-bottom: ${THEME.styles.spacing.xl};
  }
  
  .logo img {
    width: 80px;
    height: 80px;
  }
  
  .login-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: ${THEME.styles.spacing.sm};
  }
  
  .login-subtitle {
    color: ${THEME.colors.textSecondary};
    margin-bottom: ${THEME.styles.spacing.xl};
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: ${THEME.styles.spacing.md};
  }
  
  .form-group {
    text-align: left;
  }
  
  .form-label {
    display: block;
    margin-bottom: ${THEME.styles.spacing.sm};
    font-weight: 500;
    color: ${THEME.colors.text};
  }
  
  .form-input {
    width: 100%;
    padding: ${THEME.styles.spacing.sm};
    border: 1px solid ${THEME.colors.border};
    border-radius: ${THEME.styles.borderRadius.small};
    font-size: 0.9rem;
    box-sizing: border-box;
  }
  
  .form-input:focus {
    outline: none;
    border-color: ${THEME.colors.primary};
  }
  
  .login-btn {
    background: ${THEME.colors.primary};
    color: white;
    border: none;
    padding: ${THEME.styles.spacing.sm} ${THEME.styles.spacing.lg};
    border-radius: ${THEME.styles.borderRadius.small};
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: ${THEME.styles.spacing.md};
  }
  
  .login-btn:hover {
    background: ${THEME.colors.primaryHover};
  }
  
  .login-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: ${THEME.colors.error};
    font-size: 0.8rem;
    margin-top: ${THEME.styles.spacing.sm};
    display: none;
  }
`

// AdminDO login screen HTML template
const LOGIN_TEMPLATE = (demoSection) => `
  <div class="login-overlay">
    <div class="login-container">
      ${demoSection}
      <div class="logo">
        ${ADMINDO_LOGO_SVG}
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

// AdminDO dashboard HTML template
const ADMINDO_TEMPLATE = `
  <div class="admin-header">
      <div class="admin-header-content">
                  <div class="admin-logo">
            ${ADMINDO_LOGO_SVG}
        </div>
          <h1 class="admin-title">AdminDO Dashboard</h1>
      </div>
  </div>
  <div class="admin-container">
      <aside class="admin-sidebar">
          <nav>
              <!--
              <ul class="sidebar-nav" id="sidebar-nav">
                  <li><a href="#" class="nav-link active" data-view="dashboard">Dashboard</a></li>
              </ul>
              -->
              <div class="dos-section" id="dos-section">
                  <h3 class="dos-title">Durable Objects</h3>
                  <div class="dos-list" id="dos-list">
                      <!-- DOS and instances will be populated here -->
                  </div>
              </div>
              <div class="global-plugins-section" id="global-plugins-section">
                  <!-- <h3 class="global-plugins-title">Global Plugins</h3> -->
                  <ul class="global-plugins-nav" id="global-plugins-nav">
                      <!-- Global plugins will be populated here -->
                  </ul>
              </div>
          </nav>
      </aside>
      <main class="admin-content">
          <div id="dashboard-view" class="plugin-content active">
              <h2>Welcome to AdminDO</h2>
              <p>A zero-dependency admin dashboard with pluggable architecture.</p>
              <div class="plugin-grid" id="plugin-grid">
              </div>
          </div>
          <div id="instance-view" class="plugin-content">
              <div class="instance-header">
                  <h2 id="instance-title">Instance Details</h2>
                  <div class="plugin-tabs" id="plugin-tabs">
                      <!-- Plugin tabs will be populated here -->
                  </div>
              </div>
              <div class="instance-content" id="instance-content">
                  <!-- Plugin content will be populated here -->
              </div>
          </div>
          <div id="plugin-views"></div>
      </main>
  </div>
`

/**
 * Returns the AdminDO dashboard HTML template
 * @returns {string} The HTML template string
 */
function getAdminDOTemplate() {
  return ADMINDO_TEMPLATE
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
    this.currentNamespace = null
    this.currentInstanceId = null
    this.currentPlugin = null
  }

  /**
   * Switch to a different view based on route
   * @param {string} route - The route to switch to
   * @returns {void}
   */
  switchView(route) {
    const routeInfo = this.parseRoute(route)

    if (routeInfo.type === 'dashboard') {
      this.showDashboard()
    } else if (routeInfo.type === 'instance') {
      this.showInstance(routeInfo.namespace, routeInfo.instanceId, routeInfo.plugin)
    } else if (routeInfo.type === 'plugin') {
      this.showPluginView(routeInfo.plugin)
    }

    this.updateActiveNavigation(routeInfo)
  }

  /**
   * Parse a route to extract its components
   * @param {string} route - The route to parse
   * @returns {Object} Parsed route information
   */
  parseRoute(route) {
    if (route === '/' || route === '') {
      return { type: 'dashboard' }
    }

    const parts = route.replace(/^\//, '').split('/')

    if (parts.length >= 2) {
      const namespace = parts[0]
      const instanceId = parts[1]
      const plugin = parts[2] || null

      return {
        type: 'instance',
        namespace,
        instanceId,
        plugin,
      }
    } else if (parts.length === 1) {
      return {
        type: 'plugin',
        plugin: parts[0],
      }
    }

    return { type: 'dashboard' }
  }

  /**
   * Show the dashboard view
   * @returns {void}
   */
  showDashboard() {
    this.hideAllViews()
    const dashboardView = this.container.querySelector('#dashboard-view')
    if (dashboardView) {
      dashboardView.classList.add('active')
    }
    this.currentNamespace = null
    this.currentInstanceId = null
    this.currentPlugin = null
  }

  /**
   * Show instance view with plugin tabs
   * @param {string} namespace - The namespace
   * @param {string} instanceId - The instance ID
   * @param {string|null} plugin - The active plugin slug
   * @returns {void}
   */
  showInstance(namespace, instanceId, plugin = null) {
    this.hideAllViews()

    const instanceView = this.container.querySelector('#instance-view')
    if (instanceView) {
      instanceView.classList.add('active')
    }

    this.currentNamespace = namespace
    this.currentInstanceId = instanceId
    this.currentPlugin = plugin

    this.updateInstanceTitle(namespace, instanceId)
    this.renderPluginTabs(plugin)

    // Load compatible plugins and update tabs
    this.loadCompatiblePlugins(namespace, instanceId, plugin)

    if (plugin) {
      this.showPluginContent(plugin)
    }
  }

  /**
   * Load compatible plugins for the current instance
   * @param {string} namespace - The namespace
   * @param {string} instanceId - The instance ID
   * @param {string|null} activePlugin - The active plugin slug
   * @returns {Promise<void>}
   */
  async loadCompatiblePlugins(namespace, instanceId, activePlugin = null) {
    const adminComponent = this.container.closest('admin-do')
    if (!adminComponent) return

    try {
      // Get compatible plugins from the DOS manager
      const dosManager = adminComponent.dosManager
      if (!dosManager) return

      const namespaceConfig = dosManager.getNamespaceConfig(namespace)
      if (!namespaceConfig) {
        console.error('Namespace configuration not found:', namespace)
        this.renderPluginTabs(activePlugin)
        return
      }

      const compatiblePluginSlugs = namespaceConfig.compatiblePlugins || []

      // Convert slugs to plugin objects with metadata from plugin manager
      const compatiblePlugins = []
      if (adminComponent.pluginManager) {
        for (const slug of compatiblePluginSlugs) {
          const plugin = adminComponent.pluginManager.plugins.get(slug)
          if (plugin) {
            compatiblePlugins.push(plugin)
          }
        }
      }

      // Update tabs with compatible plugins
      this.renderCompatiblePluginTabs(compatiblePlugins, activePlugin)

      // If no active plugin specified, auto-select the first compatible one
      if (!activePlugin && compatiblePlugins.length > 0) {
        const firstPlugin = compatiblePlugins[0]
        adminComponent.router.navigate(`/${namespace}/${instanceId}/${firstPlugin.slug}`, false)
        return
      }

      // If current plugin is not compatible, redirect to first compatible one
      if (activePlugin && !compatiblePlugins.find((p) => p.slug === activePlugin)) {
        if (compatiblePlugins.length > 0) {
          const firstPlugin = compatiblePlugins[0]
          adminComponent.router.navigate(`/${namespace}/${instanceId}/${firstPlugin.slug}`, true)
        }
      }
    } catch (error) {
      console.error('Failed to load compatible plugins:', error)
      // Fallback to showing all instance plugins
      this.renderPluginTabs(activePlugin)
    }
  }

  /**
   * Render plugin tabs for compatible plugins
   * @param {Array} compatiblePlugins - Array of compatible plugin objects
   * @param {string|null} activePlugin - The active plugin slug
   * @returns {void}
   */
  renderCompatiblePluginTabs(compatiblePlugins, activePlugin = null) {
    const tabsContainer = this.container.querySelector('#plugin-tabs')
    if (!tabsContainer) return

    tabsContainer.innerHTML = ''

    const adminComponent = this.container.closest('admin-do')
    if (!adminComponent) return

    for (const pluginInfo of compatiblePlugins) {
      const tab = document.createElement('a')
      tab.className = 'plugin-tab'
      tab.href = '#'
      tab.dataset.plugin = pluginInfo.slug

      if (activePlugin === pluginInfo.slug) {
        tab.classList.add('active')
      }

      tab.innerHTML = `
        <span class="plugin-tab-icon">${pluginInfo.icon || '📦'}</span>
        <span>${pluginInfo.title}</span>
      `

      tab.addEventListener('click', (e) => {
        e.preventDefault()
        adminComponent.router.navigate(`/${this.currentNamespace}/${this.currentInstanceId}/${pluginInfo.slug}`)
      })

      tabsContainer.appendChild(tab)
    }

    // Show message if no compatible plugins
    if (compatiblePlugins.length === 0) {
      const noPluginsMessage = document.createElement('div')
      noPluginsMessage.className = 'no-plugins-message'
      noPluginsMessage.style.padding = '1rem'
      noPluginsMessage.style.color = '#6e6e73'
      noPluginsMessage.style.fontStyle = 'italic'
      noPluginsMessage.textContent = 'No compatible plugins found for this instance'
      tabsContainer.appendChild(noPluginsMessage)
    }
  }

  /**
   * Render plugin tabs for the current instance (fallback method)
   * @param {string|null} activePlugin - The active plugin slug
   * @returns {void}
   */
  renderPluginTabs(activePlugin = null) {
    const tabsContainer = this.container.querySelector('#plugin-tabs')
    if (!tabsContainer) return

    // Show loading state while compatibility is being checked
    tabsContainer.innerHTML = '<div style="padding: 1rem; color: #6e6e73; font-style: italic;">Loading compatible plugins...</div>'
  }

  /**
   * Show a standalone plugin view
   * @param {string} pluginSlug - The plugin slug
   * @returns {void}
   */
  showPluginView(pluginSlug) {
    this.hideAllViews()
    const pluginView = this.container.querySelector(`#${pluginSlug}-view`)
    if (pluginView) {
      pluginView.classList.add('active')
    }
    this.currentNamespace = null
    this.currentInstanceId = null
    this.currentPlugin = pluginSlug
  }

  /**
   * Hide all views
   * @returns {void}
   */
  hideAllViews() {
    this.container.querySelectorAll('.plugin-content').forEach((content) => {
      content.classList.remove('active')
    })
  }

  /**
   * Update instance title
   * @param {string} namespace - The namespace
   * @param {string} instanceId - The instance ID
   * @returns {void}
   */
  updateInstanceTitle(namespace, instanceId) {
    const titleElement = this.container.querySelector('#instance-title')
    if (titleElement) {
      titleElement.textContent = `${namespace} - ${instanceId}`
    }
  }

  /**
   * Show plugin content in the instance view
   * @param {string} pluginSlug - The plugin slug to show
   * @returns {void}
   */
  showPluginContent(pluginSlug) {
    const contentContainer = this.container.querySelector('#instance-content')
    if (!contentContainer) return

    // Hide existing plugin content
    contentContainer.querySelectorAll('.plugin-instance-content').forEach((content) => {
      content.style.display = 'none'
    })

    // Show or create plugin content for this instance
    let pluginContent = contentContainer.querySelector(`[data-plugin="${pluginSlug}"]`)
    if (!pluginContent) {
      // Create new plugin content container
      const adminComponent = this.container.closest('admin-do')
      if (adminComponent && adminComponent.pluginManager) {
        const plugin = adminComponent.pluginManager.plugins.get(pluginSlug)
        if (plugin) {
          pluginContent = document.createElement('div')
          pluginContent.className = 'plugin-instance-content'
          pluginContent.dataset.plugin = pluginSlug

          // Create plugin instance with context
          const pluginInstance = plugin.render()
          // Pass context if the plugin supports it
          if (pluginInstance.setContext) {
            pluginInstance.setContext({
              namespace: this.currentNamespace,
              instanceId: this.currentInstanceId,
            })
          }

          pluginContent.appendChild(pluginInstance)
          contentContainer.appendChild(pluginContent)
        }
      }
    }

    if (pluginContent) {
      pluginContent.style.display = 'block'
    }
  }

  /**
   * Update active navigation link
   * @param {Object} routeInfo - The parsed route information
   * @returns {void}
   */
  updateActiveNavigation(routeInfo) {
    // Update sidebar navigation
    this.container.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active')
    })

    if (routeInfo.type === 'dashboard') {
      const dashboardLink = this.container.querySelector('[data-view="dashboard"]')
      if (dashboardLink) {
        dashboardLink.classList.add('active')
      }
    } else if (routeInfo.type === 'plugin') {
      const pluginLink = this.container.querySelector(`[data-view="${routeInfo.plugin}"]`)
      if (pluginLink) {
        pluginLink.classList.add('active')
      }
    }

    // Update DOS instance highlighting
    const adminComponent = this.container.closest('admin-do')
    if (adminComponent && adminComponent.dosManager && routeInfo.type === 'instance') {
      adminComponent.dosManager.updateActiveInstance(routeInfo.namespace, routeInfo.instanceId)
    } else if (adminComponent && adminComponent.dosManager) {
      // Clear active instance if not viewing an instance
      adminComponent.dosManager.updateActiveInstance(null, null)
    }

    // Update plugin tabs
    if (routeInfo.type === 'instance' && routeInfo.plugin) {
      this.container.querySelectorAll('.plugin-tab').forEach((tab) => {
        tab.classList.remove('active')
      })

      const activeTab = this.container.querySelector(`[data-plugin="${routeInfo.plugin}"]`)
      if (activeTab) {
        activeTab.classList.add('active')
      }
    }
  }
}

/**
 * Manages durable object navigation and UI integration
 */
class DOSManager {
  /**
   * @param {HTMLElement} container - The container element
   * @param {AdminDORouter} router - The router instance
   * @param {AdminDOComponent} adminComponent - The main admin component for API access
   */
  constructor(container, router, adminComponent) {
    this.container = container
    this.router = router
    this.adminComponent = adminComponent
    this.dosConfig = {}
    this.instanceCache = new Map()
  }

  /**
   * Initialize DOS sidebar
   * @returns {Promise<void>}
   */
  async init() {
    await this.loadDOSConfiguration()
    await this.renderDOSSidebar()
  }

  /**
   * Load DOS configuration from API
   * @returns {Promise<void>}
   */
  async loadDOSConfiguration() {
    try {
      const response = await fetch(this.adminComponent.getApiUrl('/admindo/dos'), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
      })

      if (response.ok) {
        this.dosConfig = await response.json()
      } else {
        console.error('Failed to load DOS configuration:', response.statusText)
      }
    } catch (error) {
      console.error('Failed to load DOS configuration:', error)
    }
  }

  /**
   * Render the DOS sidebar with namespaces and instances
   * @returns {Promise<void>}
   */
  async renderDOSSidebar() {
    const dosList = this.container.querySelector('#dos-list')
    if (!dosList) return

    // Show loading state
    dosList.innerHTML = '<div class="dos-loading">Loading...</div>'

    // Check if we have any DOS configurations
    if (!this.dosConfig || Object.keys(this.dosConfig).length === 0) {
      dosList.innerHTML = '<div class="dos-empty">No durable objects configured</div>'
      return
    }

    dosList.innerHTML = ''

    for (const [namespace, config] of Object.entries(this.dosConfig)) {
      const dosItem = document.createElement('div')
      dosItem.className = 'dos-item'

      const namespaceElement = document.createElement('div')
      namespaceElement.className = 'dos-namespace'
      namespaceElement.textContent = config.name
      dosItem.appendChild(namespaceElement)

      const instancesContainer = document.createElement('div')
      instancesContainer.className = 'dos-instances'

      try {
        const instances = await this.getInstances(namespace)
        if (instances.length === 0) {
          const noInstancesElement = document.createElement('div')
          noInstancesElement.className = 'dos-instance'
          noInstancesElement.textContent = 'No instances'
          noInstancesElement.style.color = THEME.colors.textSecondary
          noInstancesElement.style.fontStyle = 'italic'
          instancesContainer.appendChild(noInstancesElement)
        } else {
          for (const instance of instances) {
            const instanceElement = document.createElement('a')
            instanceElement.className = 'dos-instance'
            instanceElement.href = '#'
            instanceElement.textContent = instance.name
            instanceElement.dataset.namespace = namespace
            instanceElement.dataset.instanceId = instance.slug

            instanceElement.addEventListener('click', (e) => {
              e.preventDefault()
              this.router.navigate(`/${namespace}/${instance.slug}`)
            })

            instancesContainer.appendChild(instanceElement)
          }
        }
      } catch (error) {
        console.error(`Failed to load instances for ${namespace}:`, error)
        const errorElement = document.createElement('div')
        errorElement.className = 'dos-instance'
        errorElement.textContent = 'Failed to load instances'
        errorElement.style.color = THEME.colors.error
        instancesContainer.appendChild(errorElement)
      }

      dosItem.appendChild(instancesContainer)
      dosList.appendChild(dosItem)
    }
  }

  /**
   * Get instances for a namespace, with caching
   * @param {string} namespace - The namespace to get instances for
   * @returns {Promise<Array>} Array of instances
   */
  async getInstances(namespace) {
    if (this.instanceCache.has(namespace)) {
      return this.instanceCache.get(namespace)
    }

    try {
      const response = await fetch(this.adminComponent.getApiUrl(`/admindo/dos/${namespace}/instances`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const instances = data.instances || []
        this.instanceCache.set(namespace, instances)
        return instances
      } else {
        console.error(`Failed to load instances for ${namespace}:`, response.statusText)
        return []
      }
    } catch (error) {
      console.error(`Failed to get instances for ${namespace}:`, error)
      return []
    }
  }

  /**
   * Update active instance in sidebar
   * @param {string} namespace - The namespace
   * @param {string} instanceId - The instance ID
   * @returns {void}
   */
  updateActiveInstance(namespace, instanceId) {
    // Remove active class from all instances
    this.container.querySelectorAll('.dos-instance').forEach((instance) => {
      instance.classList.remove('active')
    })

    // Add active class to selected instance
    const activeInstance = this.container.querySelector(`[data-namespace="${namespace}"][data-instance-id="${instanceId}"]`)
    if (activeInstance) {
      activeInstance.classList.add('active')
    }
  }

  /**
   * Get namespace configuration
   * @param {string} namespace - The namespace
   * @returns {Object|null} The namespace configuration
   */
  getNamespaceConfig(namespace) {
    return this.dosConfig[namespace] || null
  }

  /**
   * Refresh instances for a namespace
   * @param {string} namespace - The namespace to refresh
   * @returns {Promise<void>}
   */
  async refreshInstances(namespace) {
    this.instanceCache.delete(namespace)
    await this.getInstances(namespace)
    await this.renderDOSSidebar()
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
    /** @type {Map<string, Plugin>} */
    this.globalPlugins = new Map()
    /** @type {Map<string, Plugin>} */
    this.instancePlugins = new Map()
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

    // Determine plugin scope (default to 'instance' for backwards compatibility)
    const scope = plugin.scope || 'instance'

    if (scope === 'global') {
      this.globalPlugins.set(plugin.slug, plugin)
      this.addGlobalPluginToSidebar(plugin)
      this.addPluginView(plugin)
    } else {
      this.instancePlugins.set(plugin.slug, plugin)
      // Instance plugins don't get added to sidebar or dashboard grid
      // They only appear as tabs when viewing instances
    }

    // Always add to dashboard grid for discovery
    this.addPluginToGrid(plugin)

    // Register route for plugin
    const route = `/${plugin.slug}`
    this.router.addRoute(route, plugin)

    // Dispatch plugin registered event
    const adminComponent = this.container.closest('admin-do')
    if (adminComponent) {
      adminComponent.dispatchEvent(
        new CustomEvent('plugin-registered', {
          detail: { plugin, totalCount: this.plugins.size },
        })
      )
    }
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
      <div class="plugin-icon" style="background: ${plugin.color || THEME.colors.primary}">
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
   * Add global plugin to the sidebar navigation
   * @param {Plugin} plugin - The plugin configuration
   * @returns {void}
   */
  addGlobalPluginToSidebar(plugin) {
    const globalPluginsNav = this.container.querySelector('#global-plugins-nav')
    if (!globalPluginsNav) return

    const li = document.createElement('li')
    const viewName = plugin.slug
    li.innerHTML = `<a href="#" class="nav-link" data-view="${viewName}">${plugin.title}</a>`
    globalPluginsNav.appendChild(li)

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
    const componentInstance = plugin.render()
    view.appendChild(componentInstance)
    pluginViews.appendChild(view)
  }

  /**
   * Get instance-scoped plugins for tabs
   * @returns {Map<string, Plugin>} Instance plugins
   */
  getInstancePlugins() {
    return this.instancePlugins
  }

  /**
   * Get global plugins
   * @returns {Map<string, Plugin>} Global plugins
   */
  getGlobalPlugins() {
    return this.globalPlugins
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
    /** @type {DOSManager|undefined} */
    this.dosManager = undefined
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
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
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
        localStorage.setItem(AUTH_TOKEN_KEY, data.token)
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
    localStorage.removeItem(AUTH_TOKEN_KEY)
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

    // Initialize DOS manager and wait for it to complete before starting router
    this.dosManager = new DOSManager(this, this.router, this)
    this.dosManager
      .init()
      .then(() => {
        // Initialize router only after DOS manager is ready
        this.router.init()
      })
      .catch((error) => {
        console.error('Failed to initialize DOS manager:', error)
        // Still initialize router even if DOS manager fails
        this.router.init()
      })

    // Register any pending plugins that were waiting for authentication
    for (const plugin of this.pendingPlugins) {
      this.pluginManager.registerPlugin(plugin)
    }
    this.pendingPlugins = []
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

    return `<style>${LOGIN_STYLES}</style>${LOGIN_TEMPLATE(demoSection)}`
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
   * Get all registered plugins
   * @returns {Plugin[]} Array of all registered plugins
   */
  getAllPlugins() {
    const adminDoElement = document.querySelector('admin-do')
    if (adminDoElement && adminDoElement.pluginManager && adminDoElement.pluginManager.plugins) {
      const pluginsMap = adminDoElement.pluginManager.plugins

      // Convert Map to array more explicitly
      const pluginsArray = []
      for (const [key, plugin] of pluginsMap) {
        pluginsArray.push(plugin)
      }

      return pluginsArray
    }
    return []
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

    // Parse current route to extract namespace and instanceId
    const currentRoute = window.location.pathname
    const routeParts = currentRoute.replace(/^\//, '').split('/')

    // Check if we're on a namespace/instanceId route (/:namespace/:instanceId or /:namespace/:instanceId/:plugin)
    let namespace = null
    let instanceId = null

    if (routeParts.length >= 2 && routeParts[0] && routeParts[1]) {
      // Remove root prefix if it exists to get the actual route
      let effectiveRoute = currentRoute
      if (adminDoElement && adminDoElement.root) {
        const root = adminDoElement.root
        if (currentRoute.startsWith(root)) {
          effectiveRoute = currentRoute.substring(root.length) || '/'
        }
      }

      const effectiveParts = effectiveRoute.replace(/^\//, '').split('/')
      if (effectiveParts.length >= 2 && effectiveParts[0] && effectiveParts[1]) {
        namespace = effectiveParts[0]
        instanceId = effectiveParts[1]
      }
    }

    // Initialize headers
    const headers = { ...options.headers }

    // Automatically add auth token if available
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token && !headers.Authorization && !headers.authorization) {
      headers.Authorization = `Bearer ${token}`
    }

    // Add namespace and instanceId headers if we're on that route
    if (namespace && instanceId) {
      headers['X-AdminDO-Namespace'] = namespace
      headers['X-AdminDO-InstanceId'] = instanceId
    }

    // Update options with headers
    const updatedOptions = {
      ...options,
      headers,
    }

    return fetch(apiUrl, updatedOptions)
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
