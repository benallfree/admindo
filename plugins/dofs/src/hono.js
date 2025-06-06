import { dofs as honoDofs } from 'dofs/hono'
import pkg from '../package.json' with { type: 'json' }

/**
 * DOFS Plugin for AdminDO
 * Durable Objects File System
 */

function create(config) {
  return honoDofs()
}

function isCompatible(DOClass) {
  // DOFS plugin is compatible with Durable Objects that have file system capabilities
  // Check if the class has getFs method or fs property
  return !!DOClass.prototype.getFs
}

export const plugin = {
  slug: pkg.name,
  scope: 'instance',
  create,
  isCompatible,
}

export default plugin
