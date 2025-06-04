import { Fs, dofs as honoDofs } from 'dofs/hono'
import pkg from '../package.json' with { type: 'json' }

export const withDofs = (cls, options = {}) => {
  return class extends cls {
    constructor(ctx, env) {
      super(ctx, env)
      this.fs = new Fs(ctx, env, options)
    }
    getFs() {
      return this.fs
    }
  }
}

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
