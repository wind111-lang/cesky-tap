import { sites } from '@openai/sites-vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import hostingConfig from './.openai/hosting.json'

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000'

const { d1, r2 } = hostingConfig
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt'

const localBindingConfig = {
  main: '@tanstack/react-start/server-entry',
  d1_databases: d1
    ? [{ binding: d1, database_name: 'site-creator-d1', database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID }]
    : [],
  r2_buckets: r2 ? [{ binding: r2, bucket_name: 'site-creator-r2' }] : [],
}

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false'
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs'
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry'

  const { cloudflare } = await import('@cloudflare/vite-plugin')

  return {
    base: process.env.VITE_BASE_PATH ?? '/',
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      cloudflare({ viteEnvironment: { name: 'ssr' }, config: localBindingConfig }),
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: true,
          failOnError: true,
        },
      }),
      sites(),
      viteReact(),
    ],
  }
})
