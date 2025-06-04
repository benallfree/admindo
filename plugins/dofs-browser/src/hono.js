import { Hono } from 'hono'

/**
 * DOFS Browser Plugin for AdminDO
 * Browser interface for Durable Objects File System
 */

function create(config) {
  const app = new Hono()

  app.get('*', (c) => {
    return c.text('not implemented')
  })

  return app
}

function isCompatible(DOClass) {
  // DOFS Browser plugin is compatible with Durable Objects that have file system capabilities
  // Check if the class has getFs method or fs property
  return !!DOClass.prototype.getFs
}

export const plugin = {
  slug: 'dofs-browser',
  scope: 'instance',
  create,
  isCompatible,
}

export default plugin
