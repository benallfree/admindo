import { AdminDOPlugin } from 'admindo/hono'
import { dofs } from 'dofs/hono'

const dofsPlugin: AdminDOPlugin = {
  slug: 'dofs',
  create: (cfg) => dofs() as any,
}
