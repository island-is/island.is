import { bootstrap } from '@island.is/infra-next-server'

import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'judicial-system',
  appDir: 'apps/judicial-system/web',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint, apiUrl } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint, apiUrl]
  },
})
