import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'form-builder',
  appDir: 'apps/form-builder',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
