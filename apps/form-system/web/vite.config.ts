import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Dev-mode replacement for scripts/dockerfile-assets/bash/extract-environment:
 * expands the environment placeholder with the SI_PUBLIC_* variables from the
 * local shell, the same way the docker entrypoint does at container startup.
 * Production builds keep the placeholder for the entrypoint to expand.
 */
const injectDevEnvironment = (): Plugin => ({
  name: 'inject-dev-si-environment',
  apply: 'serve',
  transformIndexHtml(html) {
    const environment = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) =>
          key.startsWith('SI_PUBLIC_') ||
          key === 'APP_VERSION' ||
          key === 'PROD_MODE',
      ),
    )
    return html.replace(
      '<!-- environment placeholder -->',
      `<script id="__SI_ENVIRONMENT__" type="application/json">${JSON.stringify(
        environment,
      ).replace(/</g, '\\u003c')}</script>`,
    )
  },
})

export default defineConfig({
  root: __dirname,
  plugins: [
    tsconfigPaths({ root: '../../..' }),
    react(),
    vanillaExtractPlugin(),
    // Reproduce the webpack SVGR setup: named ReactComponent exports from
    // plain .svg imports, default export stays the asset URL.
    svgr({
      include: '**/*.svg',
      svgrOptions: { exportType: 'named', namedExport: 'ReactComponent' },
    }),
    injectDevEnvironment(),
  ],
  resolve: {
    // Match webpack's resolution: react-csv (and friends) publish a
    // `jsnext:main` pointing at untranspiled JSX sources.
    mainFields: ['browser', 'module', 'main'],
    alias: {
      'next/router': `${__dirname}/src/mocks/nextRouterStub.ts`,
      ...(process.env.API_MOCKS === 'true'
        ? {}
        : {
            '@island.is/api/mocks': `${__dirname}/src/mocks/apiMocksDisabled.ts`,
          }),
    },
  },
  define: {
    // The app and some libs reference the node globals.
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV ?? 'development',
    ),
    'process.env.API_MOCKS': JSON.stringify(process.env.API_MOCKS ?? ''),
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4200,
    proxy: {
      '/bff': {
        target: 'http://localhost:3010',
        secure: false,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../../../dist/apps/form-system/web-vite',
    emptyOutDir: true,
    sourcemap: true,
  },
})
