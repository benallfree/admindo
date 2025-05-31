import { Plugin } from 'admindo/hono'
import { dofs as honoDofs } from 'dofs/hono'

export const dofs: Plugin = {
  slug: 'dofs',
  create: (cfg) => honoDofs() as any,
}
