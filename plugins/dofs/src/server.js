import { dofs as honoDofs } from 'dofs/hono'
import pkg from '../package.json' with { type: 'json' }

function createDofsApp(cfg) {
  // Note: This assumes dofs/hono is available in the environment
  // In a real deployment, you would import: import { dofs as honoDofs } from 'dofs/hono'
  return honoDofs()
}

/**
 * DOFS plugin configuration for AdminDO Hono integration
 * Provides Durable Objects File System functionality
 * @type {import('admindo/hono').Plugin}
 */
export const dofs = {
  slug: pkg.name,
  create: createDofsApp,
}
