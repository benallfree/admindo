/**
 * AdminDO DOFS Plugin - Server Side
 * Durable Objects File System API plugin for AdminDO dashboard
 */

/**
 * @typedef {Object} Plugin
 * @property {string} slug - The unique slug identifier for the plugin
 * @property {function(Object): Object} create - Function that creates a Hono app instance for the plugin
 */

/**
 * Creates the DOFS plugin for AdminDO Hono integration
 * @param {Object} cfg - Configuration object passed from AdminDO
 * @returns {Object} Hono app instance with DOFS routes
 */
function createDofsApp(cfg) {
  // Note: This assumes dofs/hono is available in the environment
  // In a real deployment, you would import: import { dofs as honoDofs } from 'dofs/hono'
  return honoDofs()
}

/**
 * DOFS plugin configuration for AdminDO Hono integration
 * Provides Durable Objects File System functionality
 * @type {Plugin}
 */
export const dofs = {
  slug: 'dofs',
  create: createDofsApp,
}

// Export for CommonJS (if using module system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { dofs }
  module.exports.dofs = dofs
  module.exports.createDofsApp = createDofsApp
}

// Make available globally
if (typeof globalThis !== 'undefined') {
  globalThis.dofsPlugin = dofs
}
