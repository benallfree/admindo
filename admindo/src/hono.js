import { Hono } from 'hono'

/**
 * @typedef {Object} Instance
 * @property {string} slug - The unique slug identifier for the instance
 * @property {string} name - The display name of the instance
 */

/**
 * @typedef {Object} Plugin
 * @property {string} slug - The unique slug identifier for the plugin
 * @property {function(Object): Object} create - Function that creates a Hono app instance for the plugin
 */

/**
 * @typedef {Object} DurableObjectConfig
 * @property {string} name - The name of the Durable Object
 * @property {function(number=): Promise<Instance[]>} getInstances - Function to get instances, optionally paginated
 */

/**
 * Creates an AdminDO instance integrated with Hono
 * @param {Object} config - Configuration object
 * @param {Object.<string, DurableObjectConfig>} config.dos - Durable Objects configuration mapping
 * @param {Plugin[]} config.plugins - Array of plugin configurations
 * @returns {Hono} Hono app instance
 */
export function admindo(config) {
  // Note: This assumes Hono is available in the environment (imported elsewhere)
  // In a real deployment, you would import: import { Hono } from 'hono'
  const api = new Hono()

  // Serve the AdminDO dashboard on all routes
  api.get('/*', (c) => {
    return c.html(`
      <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <admin-do root="/admin" />
      <script type="module">
        import 'https://unpkg.com/admindo'
        import 'https://unpkg.com/admindo-plugin-auth'
        import 'https://unpkg.com/admindo-plugin-about'
        import 'https://unpkg.com/admindo-plugin-dterm'
        import 'https://unpkg.com/admindo-plugin-dorm'
        import 'https://unpkg.com/admindo-plugin-dofs-browser'
      </script>
    </body>
  </html>
`)
  })

  // Register plugin routes
  for (const plugin of config.plugins) {
    api.route(`/${plugin.slug}`, plugin.create(config))
  }

  return api
}

// Export for ES modules (if using module system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { admindo }
  module.exports.admindo = admindo
}

// Export for ES6 modules (if using import/export)
if (typeof window !== 'undefined') {
  window.admindo = admindo
}

// Make available globally
if (typeof globalThis !== 'undefined') {
  globalThis.admindo = admindo
}
