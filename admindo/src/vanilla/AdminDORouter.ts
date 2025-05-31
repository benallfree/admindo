import { AdminDOComponent } from './AdminDOComponent'
import { Plugin, RouteState } from './types'

// Simple Router for AdminDO
export class AdminDORouter {
  private component: AdminDOComponent
  private routes: Map<string, Plugin>
  private currentRoute: string | null
  private root: string

  constructor(adminDoComponent: AdminDOComponent, root: string = '') {
    this.component = adminDoComponent
    this.routes = new Map()
    this.currentRoute = null
    this.root = root.endsWith('/') ? root.slice(0, -1) : root // Remove trailing slash

    // Listen for browser navigation
    window.addEventListener('popstate', (e: PopStateEvent) => {
      this.handleRouteChange()
    })
  }

  // Register a route
  addRoute(path: string, plugin: Plugin): void {
    this.routes.set(path, plugin)
  }

  // Navigate to a route
  navigate(path: string, updateHistory: boolean = true): void {
    const fullPath = this.getFullPath(path)
    if (updateHistory) {
      history.pushState({ path: fullPath } as RouteState, '', fullPath)
    }
    this.currentRoute = path
    this.component.switchView(path)
  }

  // Handle route changes (back/forward, refresh)
  handleRouteChange(): void {
    const fullPath = window.location.pathname
    const relativePath = this.getRelativePath(fullPath)
    this.currentRoute = relativePath
    this.component.switchView(relativePath)
  }

  // Get current route
  getCurrentRoute(): string {
    return this.getRelativePath(window.location.pathname)
  }

  // Initialize router with current URL
  init(): void {
    this.handleRouteChange()
  }

  // Convert relative path to full path with root prefix
  private getFullPath(path: string): string {
    if (!this.root) return path
    if (path === '/') return this.root || '/'
    return `${this.root}${path}`
  }

  // Convert full path to relative path by removing root prefix
  private getRelativePath(fullPath: string): string {
    if (!this.root) return fullPath
    if (fullPath === this.root) return '/'
    if (fullPath.startsWith(`${this.root}/`)) {
      return fullPath.substring(this.root.length)
    }
    return fullPath
  }
}
