import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'financial-aid',
  appDir: 'apps/financial-aid/web-veita',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint, apiUrl } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint, apiUrl]
  },
})
