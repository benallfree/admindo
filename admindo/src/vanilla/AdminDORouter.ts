import { AdminDOComponent } from './AdminDOComponent'
import { PluginConfig, RouteState } from './types'

// Simple Router for AdminDO
export class AdminDORouter {
  private component: AdminDOComponent
  private routes: Map<string, PluginConfig>
  private currentRoute: string | null

  constructor(adminDoComponent: AdminDOComponent) {
    this.component = adminDoComponent
    this.routes = new Map()
    this.currentRoute = null

    // Listen for browser navigation
    window.addEventListener('popstate', (e: PopStateEvent) => {
      this.handleRouteChange()
    })
  }

  // Register a route
  addRoute(path: string, plugin: PluginConfig): void {
    this.routes.set(path, plugin)
  }

  // Navigate to a route
  navigate(path: string, updateHistory: boolean = true): void {
    if (updateHistory) {
      history.pushState({ path } as RouteState, '', path)
    }
    this.currentRoute = path
    this.component.switchView(path)
  }

  // Handle route changes (back/forward, refresh)
  handleRouteChange(): void {
    const path = window.location.pathname
    this.currentRoute = path
    this.component.switchView(path)
  }

  // Get current route
  getCurrentRoute(): string {
    return window.location.pathname
  }

  // Initialize router with current URL
  init(): void {
    this.handleRouteChange()
  }
}
