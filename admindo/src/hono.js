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
 * @typedef {Object} DurableObjectConfigItem
 * @property {string} name - The name of the Durable Object
 * @property {function(number=): Promise<Instance[]>} getInstances - Function to get instances, optionally paginated
 */

/**
 * @typedef {Record<string, DurableObjectConfigItem>} DurableObjectConfig
 */

/**
 * @typedef {Object} AdminDOConfig
 * @property {boolean} demo - Whether to enable demo mode
 * @property {DurableObjectConfig} dos - Array of Durable Object configurations that will be registered with AdminDO
 * @property {Plugin[]} plugins - Array of plugin configurations that will be registered with AdminDO
 */

/**
 * Simple JWT-like token generation and verification
 */
class SimpleAuth {
  /**
   * Generate a simple token
   * @param {Object} payload - The payload to encode
   * @param {string} secret - Secret key for signing
   * @returns {string} The generated token
   */
  static generateToken(payload, secret) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payloadStr = btoa(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })) // 24h expiry
    const signature = btoa(JSON.stringify({ secret: secret.slice(0, 8) })) // Simple signature
    return `${header}.${payloadStr}.${signature}`
  }

  /**
   * Verify a token
   * @param {string} token - The token to verify
   * @param {string} secret - Secret key for verification
   * @returns {Object|null} The decoded payload or null if invalid
   */
  static verifyToken(token, secret) {
    try {
      const [header, payload, signature] = token.split('.')
      const decodedPayload = JSON.parse(atob(payload))

      // Check expiry
      if (decodedPayload.exp && Date.now() > decodedPayload.exp) {
        return null
      }

      // Simple signature verification
      const expectedSig = btoa(JSON.stringify({ secret: secret.slice(0, 8) }))
      if (signature !== expectedSig) {
        return null
      }

      return decodedPayload
    } catch (error) {
      return null
    }
  }
}

/**
 * Create AdminDO core auth routes
 * @param {Object} c - Hono context (for environment variables)
 * @returns {Hono} Hono app instance with auth routes
 */
function createAuthRoutes() {
  const app = new Hono()

  /**
   * Get authentication status
   * @route GET /status
   */
  app.get('/status', (c) => {
    const username = c.env?.ADMINDO_SUPERUSER_USERNAME
    const password = c.env?.ADMINDO_SUPERUSER_PASSWORD

    if (!username || !password) {
      return c.json(
        {
          authenticated: false,
          message: 'Authentication not configured - ADMINDO_SUPERUSER_USERNAME and ADMINDO_SUPERUSER_PASSWORD must be set',
        },
        500
      )
    }

    const authHeader = c.req.header('Authorization')

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = SimpleAuth.verifyToken(token, password)

      if (payload && payload.username === username) {
        return c.json({
          authenticated: true,
          message: 'Authenticated as superuser',
          user: {
            username: payload.username,
            name: 'Super Admin',
          },
        })
      }
    }

    return c.json({
      authenticated: false,
      message: 'Not authenticated',
    })
  })

  /**
   * Handle login request
   * @route POST /login
   */
  app.post('/login', async (c) => {
    const expectedUsername = c.env?.ADMINDO_SUPERUSER_USERNAME
    const expectedPassword = c.env?.ADMINDO_SUPERUSER_PASSWORD

    if (!expectedUsername || !expectedPassword) {
      return c.json(
        {
          success: false,
          message: 'Authentication not configured - ADMINDO_SUPERUSER_USERNAME and ADMINDO_SUPERUSER_PASSWORD must be set',
        },
        500
      )
    }

    try {
      const body = await c.req.json()
      const { username, password } = body

      // Authenticate against environment variables
      if (username === expectedUsername && password === expectedPassword) {
        const token = SimpleAuth.generateToken({ username: expectedUsername }, expectedPassword)

        return c.json({
          success: true,
          token: token,
          user: {
            username: expectedUsername,
            name: 'Super Admin',
          },
        })
      } else {
        return c.json(
          {
            success: false,
            message: 'Invalid credentials',
          },
          401
        )
      }
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Invalid request format',
        },
        400
      )
    }
  })

  /**
   * Handle logout request
   * @route POST /logout
   */
  app.post('/logout', (c) => {
    return c.json({
      success: true,
      message: 'Logged out successfully',
    })
  })

  /**
   * Get user profile
   * @route GET /profile
   */
  app.get('/profile', (c) => {
    const username = c.env?.ADMINDO_SUPERUSER_USERNAME
    const password = c.env?.ADMINDO_SUPERUSER_PASSWORD

    if (!username || !password) {
      return c.json(
        {
          error: 'Authentication not configured',
        },
        500
      )
    }

    const authHeader = c.req.header('Authorization')

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = SimpleAuth.verifyToken(token, password)

      if (payload && payload.username === username) {
        return c.json({
          user: {
            username: payload.username,
            name: 'Super Admin',
            roles: ['superuser'],
          },
        })
      }
    }

    return c.json(
      {
        error: 'Unauthorized',
      },
      401
    )
  })

  return app
}

/**
 * Authentication middleware for protected routes
 * @param {Object} c - Hono context
 * @param {Function} next - Next middleware function
 * @returns {Response|Promise<void>} Response if unauthorized, otherwise continues
 */
function authMiddleware(c, next) {
  const username = c.env?.ADMINDO_SUPERUSER_USERNAME
  const password = c.env?.ADMINDO_SUPERUSER_PASSWORD

  if (!username || !password) {
    return c.json(
      {
        error: 'Authentication not configured - ADMINDO_SUPERUSER_USERNAME and ADMINDO_SUPERUSER_PASSWORD must be set',
      },
      500
    )
  }

  const authHeader = c.req.header('Authorization')

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = SimpleAuth.verifyToken(token, password)

    if (payload && payload.username === username) {
      c.set('user', payload)
      return next()
    }
  }

  return c.json({ error: 'Unauthorized' }, 401)
}

/**
 * Creates an AdminDO instance integrated with Hono
 * @param {AdminDOConfig} config - Configuration object for AdminDO
 * @returns {Hono} Hono app instance configured with AdminDO routes and middleware
 */
export function admindo(config) {
  const api = new Hono()

  // Register AdminDO core auth routes under /api/admindo/auth
  api.route('/api/admindo/auth', createAuthRoutes())

  // Add authentication middleware for all other API routes
  api.use('/api/*', async (c, next) => {
    const path = c.req.path

    // Skip auth middleware for AdminDO auth routes
    if (path.startsWith('/api/admindo/auth/')) {
      return next()
    }

    // Apply auth middleware for all other API routes
    return authMiddleware(c, next)
  })

  // Register plugin routes under /api/ prefix (now protected by middleware)
  for (const plugin of config.plugins) {
    api.route(`/api/${plugin.slug}`, plugin.create(config))
  }

  // Serve the AdminDO dashboard on all other routes
  api.get('/*', (c) => {
    // Generate demo credentials if demo mode is enabled
    const demoAttr = config.demo
      ? ` demo='{"username": "${c.env?.ADMINDO_SUPERUSER_USERNAME || 'admin'}", "password": "${c.env?.ADMINDO_SUPERUSER_PASSWORD || 'password'}"}'`
      : ''

    return c.html(`
      <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AdminDO Dashboard</title>
    </head>
    <body>
      <admin-do root="/admin"${demoAttr} />
      <script type="module">
        import 'https://unpkg.com/admindo'
        import 'https://unpkg.com/admindo-plugin-about'
        import 'https://unpkg.com/admindo-plugin-dterm'
        import 'https://unpkg.com/admindo-plugin-dorm'
        import 'https://unpkg.com/admindo-plugin-dofs-browser'
      </script>
    </body>
  </html>
`)
  })

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
