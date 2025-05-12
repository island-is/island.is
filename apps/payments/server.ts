import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'payments',
  appDir: 'apps/payments',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint, apiUrl } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint, apiUrl]
  },
})
