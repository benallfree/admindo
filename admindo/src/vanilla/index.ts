// Import component first to register the custom element
import AdminDOComponent from './AdminDOComponent'

// Import API setup to attach global API
import './AdminDOAPI'

// Re-export everything
export { AdminDOComponent }
export default AdminDOComponent
export type { AdminDOAPI, PluginConfig } from './AdminDOAPI'
