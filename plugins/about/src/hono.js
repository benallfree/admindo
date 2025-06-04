import { Hono } from 'hono'

/**
 * About Plugin for AdminDO
 * Provides information about AdminDO and its contributors
 */

function create(config) {
  const app = new Hono()

  app.get('*', (c) => {
    return c.text('not implemented')
  })

  return app
}

function isCompatible(DOClass) {
  // About plugin is compatible with all Durable Objects
  return true
}

export const plugin = {
  slug: 'about',
  scope: 'global',
  create,
  isCompatible,
}

export default plugin
