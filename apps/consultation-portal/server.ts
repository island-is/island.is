import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'
bootstrap({
  name: 'consultation-portal',
  appDir: 'apps/consultation-portal',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
