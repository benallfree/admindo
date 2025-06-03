import { dofs as honoDofs } from 'dofs/hono'

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
  slug: 'dofs',
  create: createDofsApp,
}
