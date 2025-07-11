import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

// DEPLOYME

bootstrap({
  name: 'air-discount-scheme',
  appDir: 'apps/air-discount-scheme/web',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint, apiUrl } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint, apiUrl]
  },
})
