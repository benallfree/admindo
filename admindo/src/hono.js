/// <reference path="./hono.d.ts" />

import { Context, Hono } from 'hono'

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
 * @param {Context} c - Hono context
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
 * @param {import('./hono').AdminDOConfig} config - Configuration object for AdminDO
 * @returns {Hono} Hono app instance configured with AdminDO routes and middleware
 */
export function admindo(config) {
  const basePath = config.basePath || '/admin'
  const api = new Hono()

  // Calculate plugin compatibility for each DOS class at startup
  for (const [namespace, dosConfig] of Object.entries(config.dos || {})) {
    if (dosConfig.classRef) {
      const compatiblePlugins = []

      // Check each instance-scoped plugin's compatibility with this DO class
      for (const plugin of config.plugins.filter((p) => p.scope === 'instance')) {
        try {
          const isCompatible = plugin.isCompatible(dosConfig.classRef)
          if (isCompatible) {
            compatiblePlugins.push(plugin.slug)
          }
        } catch (error) {
          console.error(`Error checking compatibility for plugin ${plugin.slug} with ${namespace}:`, error)
        }
      }

      // Store compatible plugin slugs in the DOS config
      dosConfig.compatiblePlugins = compatiblePlugins
    }
  }

  // Add authentication middleware for all other API routes
  api.use('/api/*', async (c, next) => {
    const path = c.req.path

    // Skip auth middleware for AdminDO auth routes
    if (path.startsWith(`${basePath}/api/admindo/auth/`)) {
      return next()
    }

    // Apply auth middleware for all other API routes
    return authMiddleware(c, next)
  })

  // Add DO context middleware for plugin routes
  api.use('/api/*', async (c, next) => {
    // Check for namespace and instanceId headers
    const namespace = c.req.header('X-AdminDO-Namespace')
    const instanceId = c.req.header('X-AdminDO-InstanceId')

    if (namespace && instanceId) {
      // Look up the DOS configuration for this namespace
      const dosConfig = config.dos?.[namespace]
      if (!dosConfig) {
        return c.json({ error: 'Access denied: DOS namespace not configured' }, 403)
      }

      const instances = await dosConfig.getInstances()

      if (!instances.find((instance) => instance.slug === instanceId)) {
        return c.json({ error: 'Access denied: Instance ID not configured' }, 403)
      }

      if (!c.env[namespace]) {
        return c.json({ error: 'Access denied: DOS namespace not found' }, 403)
      }

      try {
        // Get the DO stub for this instance
        const doId = c.env[namespace].idFromName(instanceId)
        const doStub = c.env[namespace].get(doId)

        // Add to context for plugins to use
        c.set('stub', doStub)
        c.set('namespace', namespace)
        c.set('instanceId', instanceId)
      } catch (error) {
        console.error(`Failed to get DO stub for ${namespace}/${instanceId}:`, error)
      }
    }

    return next()
  })

  // Register AdminDO core auth routes under /api/admindo/auth
  api.route('/api/admindo/auth', createAuthRoutes())

  // Add DOS endpoints under /api/admindo/dos
  api.get('/api/admindo/dos', async (c) => {
    const dosData = {}

    // Transform the DOS configuration for the frontend
    for (const [namespace, dosConfig] of Object.entries(config.dos || {})) {
      dosData[namespace] = {
        name: dosConfig.name,
        compatiblePlugins: dosConfig.compatiblePlugins || [],
      }
    }

    return c.json(dosData)
  })

  // Get instances for a specific DOS namespace
  api.get('/api/admindo/dos/:namespace/instances', async (c) => {
    const namespace = c.req.param('namespace')
    const page = parseInt(c.req.query('page') || '1')

    const dosConfig = config.dos?.[namespace]
    if (!dosConfig) {
      return c.json({ error: 'DOS namespace not found' }, 404)
    }

    try {
      const instances = await dosConfig.getInstances(page)
      return c.json({ instances })
    } catch (error) {
      console.error(`Failed to get instances for ${namespace}:`, error)
      return c.json({ error: 'Failed to load instances' }, 500)
    }
  })

  // Register plugin routes under /api/ prefix (now protected by middleware)
  for (const plugin of config.plugins) {
    api.use(`/api/${plugin.slug}/*`, async (c, next) => {
      const namespace = c.get('namespace')

      // Skip compatibility check if no namespace context (shouldn't happen in practice)
      if (!namespace) {
        return next()
      }

      // Check if this plugin is compatible with the current namespace's DO class
      const dosConfig = config.dos?.[namespace]
      if (!dosConfig || !dosConfig.compatiblePlugins) {
        return c.json({ error: 'Access denied: DOS namespace not found or not configured' }, 403)
      }

      const isCompatible = dosConfig.compatiblePlugins.includes(plugin.slug)
      if (!isCompatible) {
        return c.json({ error: 'Access denied: Plugin not compatible with this instance' }, 403)
      }

      return next()
    })

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
      <admin-do root="${basePath}"${demoAttr} />
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
