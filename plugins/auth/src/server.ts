import { Plugin } from 'admindo/hono'
import { Hono } from 'hono'

export const auth: Plugin = {
  slug: 'auth',
  create: (cfg) => {
    const app = new Hono()

    // Add auth routes here
    app.get('/status', (c) => {
      return c.json({ authenticated: false, message: 'Auth plugin active' })
    })

    return app as any
  },
}
