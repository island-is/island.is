import { bootstrap } from '@island.is/infra-next-server'

// import proxyConfig from './proxy.config.json'
const proxyConfig = {
  '/api': {
    target: process.env.API_URL ?? 'http://localhost:4444',
    secure: false,
  },
}

bootstrap({
  name: 'web',
  appDir: 'apps/web',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlUrl } = nextConfig.serverRuntimeConfig
    return [graphqlUrl]
  },
})
