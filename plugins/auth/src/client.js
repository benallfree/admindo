/**
 * AdminDO Auth Plugin - Client Side
 * A web component plugin that provides enhanced authentication functionality
 */

/**
 * @typedef {Object} User
 * @property {string} name - The user's display name
 * @property {string} email - The user's email address
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
 * Main authentication component that provides login/logout functionality
 */
class AuthComponent extends HTMLElement {
  constructor() {
    super()
    /** @type {boolean} */
    this.isAuthenticated = false
    /** @type {User|null} */
    this.currentUser = null
    this.attachShadow({ mode: 'open' })
  }

  /**
   * Called when the element is connected to the DOM
   * @returns {void}
   */
  connectedCallback() {
    this.render()
    this.setupEventListeners()
    this.checkAuthStatus()
  }

  /**
   * Set up event listeners for authentication actions
   * @returns {void}
   */
  setupEventListeners() {
    const loginBtn = this.shadowRoot?.querySelector('.login-btn')
    const logoutBtn = this.shadowRoot?.querySelector('.logout-btn')
    const loginForm = this.shadowRoot?.querySelector('.login-form')

    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.showLoginForm())
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout())
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e))
    }
  }

  /**
   * Check if user is already authenticated from stored token
   * @returns {void}
   */
  checkAuthStatus() {
    // Simulate checking authentication status
    const token = localStorage.getItem('auth-token')
    if (token) {
      this.isAuthenticated = true
      this.currentUser = { name: 'Admin User', email: 'admin@example.com' }
      this.render()
    }
  }

  /**
   * Show the login modal form
   * @returns {void}
   */
  showLoginForm() {
    const loginModal = this.shadowRoot?.querySelector('.login-modal')
    if (loginModal) {
      loginModal.style.display = 'flex'
    }
  }

  /**
   * Hide the login modal form
   * @returns {void}
   */
  hideLoginForm() {
    const loginModal = this.shadowRoot?.querySelector('.login-modal')
    if (loginModal) {
      loginModal.style.display = 'none'
    }
  }

  /**
   * Handle login form submission
   * @param {Event} e - The form submission event
   * @returns {void}
   */
  handleLogin(e) {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const email = formData.get('email')
    const password = formData.get('password')

    // Simulate authentication
    if (email && password) {
      this.isAuthenticated = true
      this.currentUser = { name: 'Admin User', email }
      localStorage.setItem('auth-token', 'fake-jwt-token')
      this.hideLoginForm()
      this.render()
    }
  }

  /**
   * Log out the current user
   * @returns {void}
   */
  logout() {
    this.isAuthenticated = false
    this.currentUser = null
    localStorage.removeItem('auth-token')
    this.render()
  }

  /**
   * Render the component's HTML
   * @returns {void}
   */
  render() {
    if (!this.shadowRoot) return

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
        }
        
        .auth-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e7;
          margin-top: 1rem;
        }
        
        .auth-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1d1d1f;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .auth-status {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          border-radius: 8px;
          background: ${this.isAuthenticated ? '#d4edda' : '#f8d7da'};
          border: 1px solid ${this.isAuthenticated ? '#c3e6cb' : '#f5c6cb'};
        }
        
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${this.isAuthenticated ? '#28a745' : '#dc3545'};
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f5f5f7;
          border-radius: 8px;
        }
        
        .user-avatar {
          width: 48px;
          height: 48px;
          background: #007AFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }
        
        .btn {
          background: #007AFF;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .btn:hover {
          background: #0056b3;
        }
        
        .btn-danger {
          background: #dc3545;
        }
        
        .btn-danger:hover {
          background: #c82333;
        }
        
        .login-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }
        
        .login-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          min-width: 400px;
        }
        
        .form-group {
          margin-bottom: 1rem;
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
        
        .session-info {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        
        .session-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .session-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e5e7;
        }
        
        .session-device {
          font-weight: 500;
        }
        
        .session-time {
          font-size: 0.8rem;
          color: #6e6e73;
        }
        
        .btn-small {
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
        }
      </style>
      
      <div class="auth-container">
        <div class="auth-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            🔐 Auth
          </div>
        </div>
        
        <div class="auth-status">
          <div class="status-indicator"></div>
          <div>
            <strong>${this.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</strong>
            <div style="font-size: 0.9rem; color: #6e6e73;">
              ${this.isAuthenticated ? 'You are successfully logged in' : 'Please log in to continue'}
            </div>
          </div>
        </div>
        
        ${
          this.isAuthenticated
            ? `
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <div>
              <div style="font-weight: 500;">${this.currentUser?.name || 'Unknown User'}</div>
              <div style="font-size: 0.9rem; color: #6e6e73;">${this.currentUser?.email || 'No email'}</div>
            </div>
          </div>
          
          <div class="session-info">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">Active Sessions</h3>
            <ul class="session-list">
              <li class="session-item">
                <div>
                  <div class="session-device">🖥️ Chrome on macOS</div>
                  <div class="session-time">Current session • Last active now</div>
                </div>
                <button class="btn btn-small btn-danger">Revoke</button>
              </li>
              <li class="session-item">
                <div>
                  <div class="session-device">📱 Safari on iOS</div>
                  <div class="session-time">Last active 2 hours ago</div>
                </div>
                <button class="btn btn-small btn-danger">Revoke</button>
              </li>
            </ul>
          </div>
          
          <button class="btn btn-danger logout-btn">Logout</button>
        `
            : `
          <div style="text-align: center; padding: 2rem;">
            <p style="margin-bottom: 1.5rem; color: #6e6e73;">Please authenticate to access the dashboard</p>
            <button class="btn login-btn">Login</button>
          </div>
        `
        }
        
        <div class="login-modal">
          <form class="login-form">
            <h2 style="margin: 0 0 1.5rem 0; text-align: center;">Login</h2>
            
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input class="form-input" type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input class="form-input" type="password" id="password" name="password" required>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
              <button type="button" class="btn" onclick="this.closest('.login-modal').style.display='none'">Cancel</button>
              <button type="submit" class="btn">Login</button>
            </div>
          </form>
        </div>
      </div>
    `
  }
}

/**
 * Simple icon component for the auth plugin
 */
class AuthIconComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  /**
   * Called when the element is connected to the DOM
   * @returns {void}
   */
  connectedCallback() {
    this.render()
  }

  /**
   * Render the icon component
   * @returns {void}
   */
  render() {
    if (!this.shadowRoot) return

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-size: inherit;
        }
      </style>
      🔐
    `
  }
}

// Register web components
if (!customElements.get('admindo-plugin-auth')) {
  customElements.define('admindo-plugin-auth', AuthComponent)
}

if (!customElements.get('admindo-plugin-auth-icon')) {
  customElements.define('admindo-plugin-auth-icon', AuthIconComponent)
}

/**
 * Plugin configuration for AdminDO auth plugin
 * @type {Plugin}
 */
const betterAuthPlugin = {
  name: 'auth',
  slug: 'auth',
  title: 'Auth',
  description: 'Superuser authentication',
  icon: '🔐',
  color: '#FF3B30',
  components: {
    panel: AuthComponent,
    icon: AuthIconComponent,
  },
}

// Export for ES modules (if using module system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = betterAuthPlugin
  module.exports.betterAuthPlugin = betterAuthPlugin
  module.exports.AuthComponent = AuthComponent
  module.exports.AuthIconComponent = AuthIconComponent
}

// Export for ES6 modules (if using import/export)
if (typeof window !== 'undefined') {
  window.betterAuthPlugin = betterAuthPlugin
  window.AuthComponent = AuthComponent
  window.AuthIconComponent = AuthIconComponent
}

// Auto-register plugin if AdminDO is available
if (typeof window !== 'undefined' && window.AdminDO?.registerPlugin) {
  window.AdminDO.registerPlugin(betterAuthPlugin)
}

// Export as default
export default betterAuthPlugin
