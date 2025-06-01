import { version } from '../../package.json'
import { AdminDORouter } from './AdminDORouter'
import { PluginManager } from './PluginManager'
import { attachAdminDOStyles } from './styles'
import { getAdminDOTemplate } from './template'
import { Plugin } from './types'

// AdminDO main component
export class AdminDOComponent extends HTMLElement {
  private pluginManager?: PluginManager
  private router: AdminDORouter

  constructor() {
    super()

    // Get root prefix from attribute, defaulting to empty string
    const root = this.getAttribute('root') || ''
    this.router = new AdminDORouter(this, root)
    this.init()
  }

  async init(): Promise<void> {
    // Apply styles
    attachAdminDOStyles()
  }

  connectedCallback(): void {
    this.render()
    this.attachEventListeners()

    // Initialize plugin manager after rendering
    this.pluginManager = new PluginManager(this, this.router)

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

  registerPlugin(plugin: Plugin): void {
    if (this.pluginManager) {
      this.pluginManager.registerPlugin(plugin)
    }
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

  private render(): void {
    this.innerHTML = getAdminDOTemplate()
  }
}
// Register the component
customElements.define('admin-do', AdminDOComponent)
// AdminDO API interface
interface AdminDOAPI {
  version: string
  component: typeof AdminDOComponent
  create(targetElement: string | Element): AdminDOComponent | null
  registerPlugin(pluginConfig: Plugin): boolean
}
// Export for ES modules
export default AdminDOComponent
export type { AdminDOAPI, Plugin as PluginConfig }
// Make available globally for non-module usage

declare global {
  interface Window {
    AdminDO: AdminDOAPI
  }
}
window.AdminDO = {
  version,
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
  registerPlugin(pluginConfig: Plugin): boolean {
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
