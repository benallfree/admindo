import { version } from '../../package.json'
import { AdminDOComponent } from './AdminDOComponent'
import { Plugin } from './types'

// AdminDO API interface
interface AdminDOAPI {
  version: string
  component: typeof AdminDOComponent
  create(targetElement: string | Element): AdminDOComponent | null
  registerPlugin(pluginConfig: Plugin): boolean
}

// Export for ES modules
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
