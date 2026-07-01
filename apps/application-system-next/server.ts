import { bootstrap } from '@island.is/infra-next-server'

import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'application-system-next',
  appDir: 'apps/application-system-next',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
