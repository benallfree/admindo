import about from 'admindo-plugin-about/hono'
import dofsBrowser from 'admindo-plugin-dofs-browser/hono'
import dofs from 'admindo-plugin-dofs/hono'
import dorm from 'admindo-plugin-dorm/hono'
import dterm from 'admindo-plugin-dterm/hono'
import stats from 'admindo-plugin-stats/hono'
import { admindo, withAdminDO } from 'admindo/hono'
import { DurableObject } from 'cloudflare:workers'
import { withDofs } from 'dofs'
import { Hono } from 'hono'

export class MyDurableObject extends withAdminDO(withDofs(DurableObject<Env>, { chunkSize: 4 * 1024 })) {}

export class MyDurableObject2 extends withAdminDO(withDofs(DurableObject<Env>, { chunkSize: 4 * 1024 })) {}

const app = new Hono<{ Bindings: Env }>()

// Mount the API middleware
app.route(
  '/admin',
  admindo({
    basePath: '/admin',
    demo: true,
    dos: {
      MY_DURABLE_OBJECT: {
        name: 'My Durable Object',
        classRef: MyDurableObject,
        async getInstances(page = 1) {
          return [
            { slug: 'instance1', name: 'Instance 1' },
            { slug: 'instance2', name: 'Instance 2' },
          ]
        },
      },
      MY_DURABLE_OBJECT_2: {
        name: 'My Durable Object 2',
        classRef: MyDurableObject2,
        async getInstances(page = 1) {
          return [
            { slug: 'instance1', name: 'Instance 1' },
            { slug: 'instance2', name: 'Instance 2' },
          ]
        },
      },
    },
    // @ts-expect-error
    plugins: [dofs, about, stats, dorm, dterm, dofsBrowser],
  })
)

export default app
