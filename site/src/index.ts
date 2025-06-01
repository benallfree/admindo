import { auth } from 'admindo-plugin-auth/server'
import { dofs } from 'admindo-plugin-dofs'
import { admindo } from 'admindo/hono'
import { DurableObject } from 'cloudflare:workers'
import { Fs } from 'dofs'
import { Hono } from 'hono'

export class MyDurableObject extends DurableObject<Env> {
  private fs: Fs

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.fs = new Fs(ctx, env, { chunkSize: 4 * 1024 })
  }

  public getFs() {
    return this.fs
  }
}

const app = new Hono<{ Bindings: Env }>()

// Mount the API middleware
app.route(
  '/admin',
  admindo({
    dos: {
      MY_DURABLE_OBJECT: {
        name: 'My Durable Object',
        async getInstances(page = 1) {
          return [{ slug: 'demo', name: 'Demo Instance' }]
        },
      },
    },
    plugins: [auth, dofs],
  })
)

export default app
