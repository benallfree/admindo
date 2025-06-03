import { Hono } from 'hono'

/**
 * @typedef {Object} Plugin
 * @property {string} slug - The unique slug identifier for the plugin
 * @property {function(Object): Object} create - Function that creates a Hono app instance for the plugin
 */

/**
 * @typedef {Object} AuthStatus
 * @property {boolean} authenticated - Whether the user is authenticated
 * @property {string} message - Status message
 */

/**
 * Creates the auth plugin for AdminDO Hono integration
 * @param {Object} cfg - Configuration object passed from AdminDO
 * @returns {Object} Hono app instance with auth routes
 */
function createAuthApp(cfg) {
  // Note: This assumes Hono is available in the environment (imported elsewhere)
  // In a real deployment, you would import: import { Hono } from 'hono'
  const app = new Hono()

  /**
   * Get authentication status
   * @route GET /status
   * @returns {AuthStatus} Authentication status response
   */
  app.get('/status', (c) => {
    return c.json({
      authenticated: false,
      message: 'Auth plugin active',
    })
  })

  /**
   * Handle login request
   * @route POST /login
   * @param {Object} c - Hono context
   * @returns {Object} Login response
   */
  app.post('/login', async (c) => {
    try {
      const body = await c.req.json()
      const { email, password } = body

      // Simulate authentication logic
      if (email && password) {
        return c.json({
          success: true,
          token: 'fake-jwt-token',
          user: {
            name: 'Admin User',
            email: email,
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
   * @param {Object} c - Hono context
   * @returns {Object} Logout response
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
   * @param {Object} c - Hono context
   * @returns {Object} User profile response
   */
  app.get('/profile', (c) => {
    // In a real implementation, you would verify the auth token here
    const authHeader = c.req.header('Authorization')

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return c.json({
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          roles: ['admin'],
        },
      })
    } else {
      return c.json(
        {
          error: 'Unauthorized',
        },
        401
      )
    }
  })

  return app
}

/**
 * Auth plugin configuration for AdminDO Hono integration
 * @type {Plugin}
 */
export const auth = {
  slug: 'auth',
  create: createAuthApp,
}
