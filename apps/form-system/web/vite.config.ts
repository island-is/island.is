import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// eslint-disable-next-line @nx/enforce-module-boundaries -- vite loads this config with plain node resolution, outside the tsconfig paths
import {
  bffDevProxy,
  define,
  injectDevSiEnvironment,
  mainFields,
  nodeBuiltinPolyfills,
  spaAliases,
} from '../../../libs/shared/vite/base'

const workspaceRoot = join(__dirname, '../../..')

export default defineConfig({
  root: __dirname,
  plugins: [
    nodeBuiltinPolyfills(),
    react(),
    vanillaExtractPlugin(),
    // Reproduce the webpack SVGR setup: named ReactComponent exports from
    // plain .svg imports, default export stays the asset URL.
    svgr({
      include: '**/*.svg',
      svgrOptions: { exportType: 'named', namedExport: 'ReactComponent' },
    }),
    injectDevSiEnvironment(),
  ],
  resolve: {
    tsconfigPaths: true,
    mainFields,
    alias: spaAliases(workspaceRoot),
  },
  define,
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4200,
    // Fail instead of drifting to another port while the browser still
    // points at the old one.
    strictPort: true,
    proxy: bffDevProxy,
  },
  build: {
    outDir: join(workspaceRoot, 'dist/apps/form-system/web-vite'),
    emptyOutDir: true,
    sourcemap: true,
    target: browserslistToEsbuild(undefined, {
      path: join(__dirname, 'src'),
    }),
  },
})
