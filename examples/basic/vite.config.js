import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineConfig({
  plugins: [
    {
      name: 'rewrite-unpkg',
      transformIndexHtml(html) {
        return html.replaceAll(`src="https://unpkg.com/admindo`, `src="@admindo`)
      },
      configureServer(server) {
        server.middlewares.use('/@admindo', (req, res, next) => {
          const filePath = resolve(__dirname, '../../admindo/src/index.js')
          const content = readFileSync(filePath, 'utf-8')
          res.setHeader('Content-Type', 'application/javascript')
          res.end(content)
        })
        const plugins = ['about', 'dofs-browser', 'dterm', 'dorm', 'better-auth']
        for (const plugin of plugins) {
          server.middlewares.use(`/@admindo-plugin-${plugin}`, (req, res, next) => {
            const filePath = resolve(__dirname, `../../plugins/${plugin}/src/index.js`)
            const content = readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/javascript')
            res.end(content)
          })
        }
      },
    },
  ],
})
