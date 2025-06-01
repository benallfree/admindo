import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    client: 'src/client.ts',
    server: 'src/server.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  bundle: false,
  outDir: 'dist',
})
