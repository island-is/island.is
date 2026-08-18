import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// eslint-disable-next-line @nx/enforce-module-boundaries -- vite loads this config with plain node resolution, outside the tsconfig paths
import {
  define,
  emitIndexSrcHtml,
  injectDevSiEnvironment,
  mainFields,
  nodeBuiltinPolyfills,
  redirectToBase,
  spaAliases,
  staticAssetsDir,
} from '../../../libs/shared/vite/base'

const workspaceRoot = join(__dirname, '../../..')

export default defineConfig({
  root: __dirname,
  base: '/stjornbord/',
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
    emitIndexSrcHtml(),
    redirectToBase('/stjornbord/'),
    staticAssetsDir(join(__dirname, 'src/assets'), '/stjornbord/assets/'),
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
    // The admin BFF is mounted under the app's base path.
    proxy: {
      '/stjornbord/bff': {
        target: 'http://localhost:3010',
        secure: false,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: join(workspaceRoot, 'dist/apps/portals/admin'),
    emptyOutDir: true,
    sourcemap: false,
    // Match the syntax support the webpack build derived from .browserslistrc
    // (vite's default baseline is newer than our browser support policy).
    target: browserslistToEsbuild(undefined, { path: __dirname }),
  },
})
