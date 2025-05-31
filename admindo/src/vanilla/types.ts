/**
 * AdminDO - Main Entry Point
 * Zero-dependency admin dashboard with pluggable architecture
 */
// Type definitions
export interface PluginConfig {
  name: string
  title: string
  description: string
  slug?: string
  icon?: string
  color?: string
}

export interface RouteState {
  path: string
}
