import { Hono } from 'hono'
import pkg from '../package.json' with { type: 'json' }

/**
 * DORM Plugin for AdminDO
 * Durable Objects ORM interface
 */

function create(config) {
  const app = new Hono()

  app.get('*', (c) => {
    return c.text('not implemented')
  })

  return app
}

function isCompatible(DOClass) {
  // DORM plugin is compatible with all Durable Objects
  return true
}

export const plugin = {
  slug: pkg.name,
  scope: 'instance',
  create,
  isCompatible,
}

export default plugin
