import { Hono } from 'hono'
import pkg from '../package.json' with { type: 'json' }

/**
 * Stats Plugin for AdminDO
 * Statistics and analytics for Durable Objects
 */

function create(config) {
  const app = new Hono()

  app.get('*', async (c) => {
    const stats = c.get('stub').getAdminDO()
    const sqlStorageSize = await stats.sqlStorageSize()
    return c.json([
      {
        name: 'SQL Storage Size',
        type: 'progress',
        value: sqlStorageSize * 100000,
        max: 10 * 1024 * 1024 * 1024, // 10GB in bytes
        color: 'blue',
        icon: '💾',
        description: 'The size of the SQL database in bytes',
      },
    ])
  })

  return app
}

function isCompatible(DOClass) {
  // Stats plugin is compatible with all Durable Objects
  return !!DOClass.prototype.getAdminDO
}

export const plugin = {
  slug: pkg.name,
  scope: 'instance',
  create,
  isCompatible,
}

export default plugin
