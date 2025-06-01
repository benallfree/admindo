import { AdminDORouter } from './AdminDORouter'
import { PluginManager } from './PluginManager'
import { ViewManager } from './ViewManager'
import { attachAdminDOStyles } from './styles'
import { getAdminDOTemplate } from './template'
import { Plugin } from './types'

// AdminDO main component
export class AdminDOComponent extends HTMLElement {
  private pluginManager?: PluginManager
  private router: AdminDORouter
  private viewManager?: ViewManager

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

    // Initialize managers after rendering
    this.viewManager = new ViewManager(this)
    this.pluginManager = new PluginManager(this, this.router)

    // Initialize router after rendering
    setTimeout(() => {
      this.router.init()
    }, 0)
  }

  switchView(route: string): void {
    this.viewManager?.switchView(route)
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

// Export for ES modules
export default AdminDOComponent
