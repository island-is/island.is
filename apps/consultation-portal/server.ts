// TRIGGERLINE FOR DEPLOYMENT - DO NOT MERGE
import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config'

bootstrap({
  name: 'consultation-portal',
  appDir: 'apps/consultation-portal',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
