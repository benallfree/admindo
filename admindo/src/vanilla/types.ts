/**
 * AdminDO - Main Entry Point
 * Zero-dependency admin dashboard with pluggable architecture
 */
// Type definitions
export interface Plugin {
  name: string
  title: string
  description: string
  slug?: string
  icon?: string
  color?: string
  components: {
    panel: typeof HTMLElement
    icon: typeof HTMLElement
  }
}

export interface RouteState {
  path: string
}
