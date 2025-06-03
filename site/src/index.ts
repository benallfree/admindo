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

export class MyDurableObject2 extends DurableObject<Env> {
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
    demo: true,
    dos: {
      MY_DURABLE_OBJECT: {
        name: 'My Durable Object',
        async getInstances(page = 1) {
          return [
            { slug: 'instance1', name: 'Instance 1' },
            { slug: 'instance2', name: 'Instance 2' },
          ]
        },
      },
      MY_DURABLE_OBJECT_2: {
        name: 'My Durable Object 2',
        async getInstances(page = 1) {
          return [
            { slug: 'instance1', name: 'Instance 1' },
            { slug: 'instance2', name: 'Instance 2' },
          ]
        },
      },
    },
    plugins: [dofs],
  })
)

export default app
