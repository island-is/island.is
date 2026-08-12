const { composePlugins, withNx } = require('@nx/next')
const fs = require('fs')
const path = require('path')

const tinymceDir = path.dirname(require.resolve('tinymce/package.json'))

const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
})

// TinyMCE is self-hosted: the editor loads /tinymce/tinymce.min.js and its
// assets from public/ at runtime (tinymceScriptSrc), so they must be copied
// out of node_modules. Previously done with CopyWebpackPlugin.
for (const asset of ['tinymce.min.js', 'plugins', 'skins', 'themes', 'icons']) {
  fs.cpSync(
    path.join(tinymceDir, asset),
    path.join(__dirname, 'public/tinymce', asset),
    { recursive: true },
  )
}

const nextConfig = {
  experimental: {
    // Source maps for the server production bundle, previously configured
    // through the custom webpack config (config.devtool).
    serverSourceMaps: true,
  },
  // Runtime configuration lives in environments/runtimeEnvironment.ts
  env: {
    API_MOCKS: process.env.API_MOCKS ?? '',
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
