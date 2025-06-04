import { Hono } from 'hono'
import pkg from '../package.json' with { type: 'json' }

/**
 * Stats Plugin for AdminDO
 * Statistics and analytics for Durable Objects
 */

function create(config) {
  const app = new Hono()

  app.get('*', (c) => {
    const stats = c.get('stub').getStats()
    return c.json(stats)
  })

  return app
}

function isCompatible(DOClass) {
  // Stats plugin is compatible with all Durable Objects
  return !!DOClass.prototype.getStats
}

export const plugin = {
  slug: pkg.name,
  scope: 'global',
  create,
  isCompatible,
}

export default plugin
