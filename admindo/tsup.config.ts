import { copyFileSync } from 'fs'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    vanilla: 'src/vanilla/index.ts',
    hono: 'src/hono/index.ts',
  },
  format: ['esm'],
  dts: true,
  external: ['cloudflare:workers'],
  outDir: 'dist',
  clean: true,
  bundle: true,
  outExtension({ format }) {
    console.log('format', format)
    return {
      js: `.${format === 'esm' ? 'mjs' : 'js'}`,
    }
  },
  onSuccess: async () => {
    console.log('Copying README.md to root')
    copyFileSync('README.md', '../README.md')
  },
})
