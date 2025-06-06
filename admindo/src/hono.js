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
    const signature = btoa(JSON.stringify({ secret })) // Use full secret
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
      const expectedSig = btoa(JSON.stringify({ secret })) // Use full secret
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
 * Symbol used to identify AdminDO instances on Durable Objects
 */
export const ADMIN_DO = Symbol('AdminDO')

/**
 * AdminDO class that provides plugin API access for Durable Objects
 */
export class AdminDO {
  /**
   * @param {DurableObjectState} ctx - The Durable Object state
   * @param {any} env - Environment bindings
   */
  constructor(ctx, env) {
    this.ctx = ctx
    this.env = env
  }

  /**
   * Execute SQL query against the Durable Object's storage
   * @param {string} query - SQL query to execute
   * @param {...any} bindings - Query parameters
   * @returns {any} Query result
   */
  execSql(query, ...bindings) {
    this.ctx.storage.sql.exec(query, ...bindings)
  }

  /**
   * Get the current SQL storage size in bytes
   * @returns {number} Storage size in bytes
   */
  sqlStorageSize() {
    return this.ctx.storage.sql.databaseSize()
  }

  /**
   * Check if an object has AdminDO functionality
   * @param {any} obj - Object to check
   * @returns {boolean} True if object has AdminDO functionality
   */
  static hasAdminDO(classRef) {
    return 'getAdminDO' in classRef?.prototype
  }
}

export const withAdminDO = (cls) => {
  return class extends cls {
    constructor(ctx, env) {
      super(ctx, env)
      this[ADMIN_DO] = new AdminDO(ctx, env)
    }

    getAdminDO() {
      return this[ADMIN_DO]
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
export function auth(c, next) {
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
 * DO context middleware - sets up Durable Object stub and context
 * @param {Context} c - Hono context
 * @param {Function} next - Next middleware function
 * @returns {Response|Promise<void>} Response if error, otherwise continues
 */
export function doContext(config) {
  return async (c, next) => {
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
        return c.json({ error: 'Failed to initialize Durable Object' }, 500)
      }
    }

    return next()
  }
}

/**
 * Plugin compatibility middleware - checks if plugin is compatible with current DO
 * @param {string} pluginSlug - The plugin slug to check compatibility for
 * @param {Object} config - AdminDO configuration
 * @returns {Function} Middleware function
 */
export function pluginCompatibility(pluginSlug, config) {
  return async (c, next) => {
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

    const isCompatible = dosConfig.compatiblePlugins.includes(pluginSlug)
    if (!isCompatible) {
      return c.json({ error: 'Access denied: Plugin not compatible with this instance' }, 403)
    }

    console.log(`plugin ${pluginSlug} is compatible with ${c.req.url}`)

    return next()
  }
}

/**
 * Creates an AdminDO instance integrated with Hono
 * @param {import('./hono').AdminDOConfig} config - Configuration object for AdminDO
 * @returns {Hono} Hono app instance configured with AdminDO routes and middleware
 */
export function admindo(config) {
  const basePath = config.basePath || '/admin'

  // Create separate Hono apps for different route groups
  const admindoApi = new Hono()
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

  // AdminDO API Routes (/api/admindo)

  // Register AdminDO core auth routes under /auth (no auth middleware needed)
  admindoApi.route('/auth', createAuthRoutes())

  // Add DOS endpoints under /dos (with auth middleware)
  admindoApi.get('/dos', auth, async (c) => {
    const dosData = {}

    // Transform the DOS configuration for the frontend
    for (const [namespace, dosConfig] of Object.entries(config.dos || {})) {
      // Check if the Durable Object class has AdminDO functionality
      // This could be indicated by having the ADMIN_DO symbol on the prototype or constructor
      if (AdminDO.hasAdminDO(dosConfig.classRef)) {
        dosData[namespace] = {
          name: dosConfig.name,
          compatiblePlugins: dosConfig.compatiblePlugins || [],
        }
      }
    }

    return c.json(dosData)
  })

  // Get instances for a specific DOS namespace (with auth middleware)
  admindoApi.get('/dos/:namespace/instances', auth, async (c) => {
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

  // Main API Routes (/api)

  // Mount the AdminDO API under /admindo
  api.route('/admindo', admindoApi)

  // Register plugin routes with explicit middleware
  for (const plugin of config.plugins) {
    console.log(`mounting plugin ${plugin.slug}`)

    // Apply explicit middleware to plugin routes
    api.use(`/${plugin.slug}/*`, auth, doContext(config), pluginCompatibility(plugin.slug, config))

    api.route(`/${plugin.slug}`, plugin.create(config))
  }

  // Create main app that mounts the API and serves the dashboard
  const app = new Hono()

  // Mount the API under /api
  app.route('/api', api)

  // Serve the AdminDO dashboard on all other routes
  app.get('/*', (c) => {
    // Generate demo credentials if demo mode is enabled
    const demoAttr = config.demo
      ? ` demo='{"username": "${c.env?.ADMINDO_SUPERUSER_USERNAME || 'admin'}", "password": "${c.env?.ADMINDO_SUPERUSER_PASSWORD || 'password'}"}'`
      : ''

    // Generate dynamic plugin imports based on loaded plugins
    const pluginImports = config.plugins
      .map(
        (plugin) => `import('/@unpkg/${plugin.slug}').then(module => {
          console.log('Loaded plugin ${plugin.slug}')
        }).catch(err => {
      console.warn('Failed to load plugin ${plugin.slug}:', err)
    })`
      )
      .join('\n')

    return c.html(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AdminDO Dashboard</title>
            <script type="module">
            import '/@unpkg/admindo'
            ${pluginImports}
          </script>
        </head>
        <body>
          <admin-do root="${basePath}"${demoAttr} />
        
        </body>
      </html>
    `)
  })

  return app
}

export { admindo, AdminDO, withAdminDO }
