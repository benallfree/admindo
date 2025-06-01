import { AdminDORouter } from './AdminDORouter'
import { Plugin } from './types'

export class PluginManager {
  private plugins: Map<string, Plugin>
  private container: HTMLElement
  private router: AdminDORouter

  constructor(container: HTMLElement, router: AdminDORouter) {
    this.plugins = new Map()
    this.container = container
    this.router = router
  }

  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin)

    // Register route for plugin
    const route = `/${plugin.slug || plugin.name}`
    this.router.addRoute(route, plugin)

    this.addPluginToGrid(plugin)
    this.addPluginToNav(plugin)
    this.addPluginView(plugin)
  }

  private addPluginToGrid(plugin: Plugin): void {
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

  private addPluginToNav(plugin: Plugin): void {
    const nav = this.container.querySelector('#sidebar-nav')
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

  private addPluginView(plugin: Plugin): void {
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
