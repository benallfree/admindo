/**
 * AdminDO Vanilla JavaScript - Type Definitions
 */

/**
 * Plugin configuration for AdminDO vanilla integration
 */
export interface Plugin {
  /** The display title of the plugin */
  title: string
  /** A description of what the plugin does */
  description: string
  /** The unique slug identifier for the plugin (used for routing and component naming) */
  slug: string
  /** Optional icon for the plugin (emoji or HTML) */
  icon?: string
  /** Optional color for the plugin icon background */
  color?: string
  /** Plugin render component */
  render: typeof HTMLElement
}

/**
 * Route state information
 */
export interface RouteState {
  /** The current route path */
  path: string
}

/**
 * AdminDO API interface for global usage
 */
export interface AdminDOAPI {
  /** The AdminDO version */
  version: string
  /** The AdminDOComponent class */
  component: typeof AdminDOComponent
  /** Create a new AdminDO instance */
  create: (targetElement: string | Element) => AdminDOComponent | null
  /** Register a plugin globally */
  registerPlugin: (pluginConfig: Plugin) => boolean
  /** Fetch helper with automatic root prefix and auth */
  fetch: (path: string, options?: RequestInit) => Promise<Response>
}

/**
 * AdminDO main web component class
 */
export declare class AdminDOComponent extends HTMLElement {
  root: string
  demoCredentials: any | null
  router: any
  viewManager?: any
  pluginManager?: any
  isAuthenticated: boolean
  pendingPlugins: Plugin[]

  constructor()
  getApiUrl(path: string): string
  init(): Promise<void>
  checkAuthStatus(): Promise<boolean>
  handleLogin(username: string, password: string): Promise<{ success: boolean; message?: string }>
  handleLogout(): void
  initializeDashboard(): void
  connectedCallback(): void
  switchView(route: string): void
  registerPlugin(plugin: Plugin): void
  attachEventListeners(): void
  renderLoginScreen(): string
  render(): void
}

declare global {
  interface Window {
    AdminDO: AdminDOAPI
    AdminDOComponent: typeof AdminDOComponent
  }
}
