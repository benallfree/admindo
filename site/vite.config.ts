import { cloudflare } from '@cloudflare/vite-plugin'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'public',
  plugins: [
    cloudflare(),
    {
      name: 'rewrite-unpkg',
      // Transform any imported file that contains unpkg URLs
      transform(code, id) {
        if (code.includes('https://unpkg.com/admindo')) {
          return code.replaceAll('https://unpkg.com/admindo', '/@admindo')
        }
        return null
      },
      configureServer(server) {
        server.middlewares.use('/@admindo/vanilla', (req, res, next) => {
          const filePath = resolve(__dirname, '../admindo/dist/vanilla.mjs')
          const content = readFileSync(filePath, 'utf-8')
          res.setHeader('Content-Type', 'application/javascript')
          res.end(content)
        })
        const plugins = ['about', 'dofs-browser', 'dterm', 'dorm', 'better-auth']
        for (const plugin of plugins) {
          server.middlewares.use(`/@admindo-plugin-${plugin}`, (req, res, next) => {
            const filePath = resolve(__dirname, `../plugins/${plugin}/src/index.js`)
            const content = readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/javascript')
            res.end(content)
          })
        }
      },
    },
  ],
})
