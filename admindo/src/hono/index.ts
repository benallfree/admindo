import { Hono } from 'hono'

declare namespace Cloudflare {
  interface Env {}
}

// Extend the context type to include our fs property
export type Context = {}

export type Plugin = {
  slug: string
  create: (config: Config<any>) => Hono<{ Bindings: any }>
}

export type Instance = {
  slug: string
  name: string
}

export type Config<TEnv extends Cloudflare.Env> = {
  dos: Partial<
    Record<
      keyof TEnv,
      {
        name: string
        getInstances: (page?: number) => Promise<Instance[]>
      }
    >
  >
  plugins: Plugin[]
}

export const admindo = <TEnv extends Cloudflare.Env>(config: Config<TEnv>) => {
  const api = new Hono<{ Bindings: TEnv } & Context>()

  api.get('/*', (c) => {
    return c.html(`
      <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <admin-do root="/admin" />
      <script type="module">
        import 'https://unpkg.com/admindo/vanilla'
        import 'https://unpkg.com/admindo-plugin-auth'
        import 'https://unpkg.com/admindo-plugin-about'
        import 'https://unpkg.com/admindo-plugin-dterm'
        import 'https://unpkg.com/admindo-plugin-dorm'
        import 'https://unpkg.com/admindo-plugin-dofs-browser'
      </script>
    </body>
  </html>
`)
  })

  for (const plugin of config.plugins) {
    api.route(`/${plugin.slug}`, plugin.create(config))
  }

  return api
}
