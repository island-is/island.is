const path = require('path')
const fs = require('fs')
const { IgnorePlugin } = require('webpack')
const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default
const { DuplicatesPlugin } = require('inspectpack/plugin')

/**
 * Checks if a file contains NestJS decorators that SWC can't handle.
 */
function fileHasNestJSDecorators(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return /@(Module|Global|Injectable|Controller|Guard|Interceptor|Pipe|Filter)\s*\(/g.test(
      content,
    )
  } catch {
    return false
  }
}

/**
 * Resolves a module path with TypeScript extensions.
 */
function resolveModulePath(baseDir, importPath) {
  const extensions = ['.ts', '.tsx', '.js', '.jsx']
  const fullPath = path.resolve(baseDir, importPath)

  for (const ext of extensions) {
    const withExt = fullPath + ext
    if (fs.existsSync(withExt)) return withExt
  }

  for (const ext of extensions) {
    const indexPath = path.join(fullPath, 'index' + ext)
    if (fs.existsSync(indexPath)) return indexPath
  }

  return null
}

/**
 * Checks if a barrel file (or any of its re-exports) contains NestJS decorators.
 */
function barrelHasNestJSCode(barrelPath, visited = new Set()) {
  if (visited.has(barrelPath)) return false
  visited.add(barrelPath)

  try {
    const content = fs.readFileSync(barrelPath, 'utf-8')
    const dir = path.dirname(barrelPath)

    if (fileHasNestJSDecorators(barrelPath)) return true

    const reExportPattern = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g
    let match

    while ((match = reExportPattern.exec(content)) !== null) {
      const importPath = match[1]
      const resolvedPath = resolveModulePath(dir, importPath)
      if (resolvedPath) {
        if (fileHasNestJSDecorators(resolvedPath)) return true
        if (
          resolvedPath.endsWith('index.ts') &&
          barrelHasNestJSCode(resolvedPath, visited)
        ) {
          return true
        }
      }
    }
    return false
  } catch {
    return false
  }
}

/**
 * Checks if a file exports a specific name.
 */
function fileHasExport(filePath, exportName) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const pattern = new RegExp(
      `export\\s+(const|let|var|function|class)\\s+${exportName}\\b`,
    )
    return pattern.test(content)
  } catch {
    return false
  }
}

/**
 * Finds the source file for a specific export in a barrel file.
 */
function findExportSource(barrelPath, exportName) {
  try {
    const content = fs.readFileSync(barrelPath, 'utf-8')
    const dir = path.dirname(barrelPath)

    const reExportPattern = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g
    let match

    while ((match = reExportPattern.exec(content)) !== null) {
      const importPath = match[1]
      const resolvedPath = resolveModulePath(dir, importPath)
      if (resolvedPath && fileHasExport(resolvedPath, exportName)) {
        return resolvedPath
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Gets export names from a single file.
 */
function getFileExportNames(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const exportNames = []
    const pattern = /export\s+(const|let|var|function|class)\s+(\w+)/g
    let match
    while ((match = pattern.exec(content)) !== null) {
      exportNames.push(match[2])
    }
    return exportNames
  } catch {
    return []
  }
}

/**
 * Finds all export names from a barrel file.
 */
function getBarrelExportNames(barrelPath) {
  try {
    const content = fs.readFileSync(barrelPath, 'utf-8')
    const dir = path.dirname(barrelPath)
    const exportNames = new Set()

    // Direct exports
    const directExportPattern = /export\s+(const|let|var|function|class)\s+(\w+)/g
    let match
    while ((match = directExportPattern.exec(content)) !== null) {
      exportNames.add(match[2])
    }

    // Re-exports
    const reExportPattern = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g
    while ((match = reExportPattern.exec(content)) !== null) {
      const importPath = match[1]
      const resolvedPath = resolveModulePath(dir, importPath)
      if (resolvedPath) {
        const nestedExports = getFileExportNames(resolvedPath)
        nestedExports.forEach((name) => exportNames.add(name))
      }
    }

    return Array.from(exportNames)
  } catch {
    return []
  }
}

/** Cache for NestJS packages detection */
let nestJSPackagesCache = null

/**
 * Gets all @island.is/* packages that contain NestJS decorators.
 */
function getPackagesWithNestJS() {
  if (nestJSPackagesCache !== null) return nestJSPackagesCache

  const packagesWithNestJS = []
  const workspaceRoot = path.resolve(__dirname, '../..')

  try {
    const tsconfigPath = path.resolve(workspaceRoot, 'tsconfig.base.json')
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
    const paths = tsconfig.compilerOptions?.paths || {}

    const packages = Object.keys(paths)
      .filter((key) => key.startsWith('@island.is/'))
      .map((key) => key.replace('/*', ''))

    for (const pkg of packages) {
      const barrelPath = path.resolve(
        workspaceRoot,
        'libs',
        ...pkg.replace('@island.is/', '').split('/'),
        'src',
        'index.ts',
      )

      if (fs.existsSync(barrelPath) && barrelHasNestJSCode(barrelPath)) {
        packagesWithNestJS.push(pkg)
      }
    }
  } catch (e) {
    console.warn('[getPackagesWithNestJS] Error:', e.message)
  }

  nestJSPackagesCache = packagesWithNestJS
  return packagesWithNestJS
}

/**
 * Automatically extract all @island.is/* packages from tsconfig.base.json.
 * Excludes packages that contain NestJS decorators (detected automatically).
 */
function getIslandPackages() {
  try {
    const tsconfigPath = path.resolve(__dirname, '../../tsconfig.base.json')
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
    const paths = tsconfig.compilerOptions?.paths || {}
    const nestJSPackages = getPackagesWithNestJS()

    return Object.keys(paths)
      .filter((key) => key.startsWith('@island.is/'))
      .map((key) => key.replace('/*', ''))
      .filter((key) => !nestJSPackages.includes(key))
  } catch (e) {
    console.warn(
      'Failed to read tsconfig.base.json for package optimization:',
      e.message,
    )
    return []
  }
}

/**
 * Automatically generates webpack aliases for all @island.is/* packages
 * that contain NestJS code in their barrel files.
 *
 * This scans each package's barrel, checks if it has NestJS decorators,
 * and if so, creates aliases to redirect imports to safe source files.
 */
function getExportFinderAliases() {
  const aliases = {}
  const workspaceRoot = path.resolve(__dirname, '../..')

  try {
    const nestJSPackages = getPackagesWithNestJS()

    for (const pkg of nestJSPackages) {
      const barrelPath = path.resolve(
        workspaceRoot,
        'libs',
        ...pkg.replace('@island.is/', '').split('/'),
        'src',
        'index.ts',
      )

      if (!fs.existsSync(barrelPath)) continue

      // Find a safe file to alias to (one without NestJS decorators)
      const exportNames = getBarrelExportNames(barrelPath)

      for (const exportName of exportNames) {
        const sourcePath = findExportSource(barrelPath, exportName)
        if (sourcePath && !fileHasNestJSDecorators(sourcePath)) {
          aliases[pkg] = sourcePath.replace(/\.tsx?$/, '')
          break
        }
      }
    }
  } catch (e) {
    console.warn('[getExportFinderAliases] Error:', e.message)
  }

  return aliases
}

const graphqlPath = '/api/graphql'
const {
  API_URL = 'http://localhost:4444',
  DISABLE_API_CATALOGUE,
  DD_LOGS_CLIENT_TOKEN,
  APP_VERSION,
  ENVIRONMENT,
  CONFIGCAT_SDK_KEY,
} = process.env

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Skip ESLint during builds (CI runs lint separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Use SWC for minification (faster than Terser)
  swcMinify: true,
  // Transform barrel imports to direct imports (SWC replacement for babel-plugin-transform-imports)
  modularizeImports: {
    '@island.is/island-ui/core': {
      transform: '@island.is/island-ui/core/src/lib/{{member}}/{{member}}',
      skipDefaultConversion: true,
    },
    '@island.is/island-ui/contentful': {
      transform:
        '@island.is/island-ui/contentful/src/lib/{{member}}/{{member}}',
      skipDefaultConversion: true,
    },
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true,
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
      preventFullImport: true,
    },
  },
  // Optimize barrel file imports (automatic optimization for listed packages)
  experimental: {
    optimizePackageImports: [...getIslandPackages()],
  },
  async rewrites() {
    return [
      {
        source: '/umsoknir/:slug',
        destination: 'https://island.is/umsoknir/:slug',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
      {
        source: '/opinbernyskopun/rss.xml',
        destination: '/api/rss/opinbernyskopun',
      },
      {
        source: '/rss/domar',
        destination: '/api/domar/rss',
      },
      {
        source: '/rss/domar.xml',
        destination: '/api/domar/rss',
      },
      {
        source: '/rss/dagskra-domstola',
        destination: '/api/dagskra-domstola/rss',
      },
      {
        source: '/rss/dagskra-domstola.xml',
        destination: '/api/dagskra-domstola/rss',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/en/organizations',
        destination: '/en/o',
        permanent: true,
      },
      {
        source: '/en/organizations/:slug',
        destination: '/en/o/:slug',
        permanent: true,
      },
      {
        source: '/en/organizations/:slug/:subSlug',
        destination: '/en/o/:slug/:subSlug',
        permanent: true,
      },
      {
        source: '/stofnanir',
        destination: '/s',
        permanent: true,
      },
      {
        source: '/s/haskolanam',
        destination: '/haskolanam',
        permanent: true,
      },
      {
        source: '/en/o/university-studies',
        destination: '/university-studies',
        permanent: true,
      },
      {
        source: '/stofnanir/:slug',
        destination: '/s/:slug',
        permanent: true,
      },
      {
        source: '/stofnanir/:slug/:subSlug',
        destination: '/s/:slug/:subSlug',
        permanent: true,
      },
      {
        source: '/handbaekur',
        destination: '/leit?q=*&type=webManual',
        permanent: true,
      },
      {
        source: '/en/manuals',
        destination: '/en/search?q=*&type=webManual',
        permanent: true,
      },
      {
        source: '/en/o/icelandic-health-insurance',
        destination: '/en/o/iceland-health',
        permanent: true,
      },
      {
        source: '/en/help/icelandic-health-insurance',
        destination: '/en/help/iceland-health',
        permanent: true,
      },
      {
        source: '/en/o/icelandic-health-insurance/:subSlug*',
        destination: '/en/o/iceland-health/:subSlug*',
        permanent: true,
      },
      {
        source: '/en/help/icelandic-health-insurance/:subSlug*',
        destination: '/en/help/iceland-health/:subSlug*',
        permanent: true,
      },
      {
        source: '/adstod/tryggingastofnun/hafa-samband',
        destination: 'https://minarsidur.tr.is/hafa-samband',
        permanent: true,
      },
      {
        source: '/en/help/social-insurance-administration/contact-us',
        destination: 'https://minarsidur.tr.is/hafa-samband',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source:
          '/.well-known/apple-developer-merchantid-domain-association.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer, dev }) => {
    if (process.env.ANALYZE === 'true' && !isServer) {
      config.plugins.push(
        new DuplicatesPlugin({
          emitErrors: false,
          verbose: true,
        }),
      )

      config.plugins.push(
        new StatoscopeWebpackPlugin({
          saveTo: 'dist/apps/web/statoscope.html',
          saveStatsTo: 'dist/apps/web/stats.json',
          statsOptions: { all: true, source: false },
        }),
      )

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        }),
      )
    }

    if (!isServer) {
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^@island.is\/clients\/middlewares$/,
        }),
      )
    }

    if (!dev && isServer) {
      config.devtool = 'source-map'
    }

    const modules = path.resolve(__dirname, '../..', 'node_modules')

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Auto-generated aliases for packages with NestJS code in barrel files
      ...getExportFinderAliases(),
      '@babel/runtime': path.resolve(modules, '@babel/runtime'),
      'bn.js': path.resolve(modules, 'bn.js'),
      'date-fns': path.resolve(modules, 'date-fns'),
      'es-abstract': path.resolve(modules, 'es-abstract'),
      'escape-string-regexp': path.resolve(modules, 'escape-string-regexp'),
      'readable-stream': path.resolve(modules, 'readable-stream'),
      'react-popper': path.resolve(modules, 'react-popper'),
      inherits: path.resolve(modules, 'inherits'),
      'graphql-tag': path.resolve(modules, 'graphql-tag'),
      'safe-buffer': path.resolve(modules, 'safe-buffer'),
      scheduler: path.resolve(modules, 'scheduler'),
    }

    return config
  },

  serverRuntimeConfig: {
    // Will only be available on the server side
    // Requests made by the server are internal request made directly to the api hostname
    graphqlUrl: API_URL,
    graphqlEndpoint: graphqlPath,
  },

  publicRuntimeConfig: {
    // Will be available on both server and client
    graphqlUrl: '',
    graphqlEndpoint: graphqlPath,
    disableApiCatalog: DISABLE_API_CATALOGUE,
    ddLogsClientToken: DD_LOGS_CLIENT_TOKEN,
    appVersion: APP_VERSION,
    environment: ENVIRONMENT,
    configCatSdkKey: CONFIGCAT_SDK_KEY,
  },

  env: {
    API_MOCKS: process.env.API_MOCKS || '',
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
