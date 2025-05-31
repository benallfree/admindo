/// <reference types="./worker-configuration.d.ts" />

import { Hono } from 'hono'

// Extend the context type to include our fs property
export type AdminDOContext = {}

export type AdminDOPlugin = {
  slug: string
  create: (config: AdminDOConfig<any>) => Hono<{ Bindings: any }>
}

export type AdminDOConfig<TEnv extends Cloudflare.Env> = {
  dos: Record<keyof TEnv, string>
  plugins: AdminDOPlugin[]
}

export const admindo = <TEnv extends Cloudflare.Env>(config: AdminDOConfig<TEnv>) => {
  const api = new Hono<{ Bindings: TEnv } & AdminDOContext>()

  api.get('/*', (c) => {
    return c.html(`
      <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <admin-do />
      <script type="module">
        import 'https://unpkg.com/admindo/vanilla'
        import 'https://unpkg.com/admindo-plugin-about'
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
