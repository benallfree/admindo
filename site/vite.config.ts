import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import { unpkg } from 'vite-plugin-unpkg'

export default defineConfig(({ mode }) => ({
  publicDir: 'public',
  plugins: [cloudflare(), unpkg({ mode, root: __dirname })],
}))
