import { bootstrap } from '@island.is/infra-next-server'

import proxyConfig from './proxy.conf.json'

bootstrap({
  name: 'skilavottord',
  appDir: 'apps/skilavottord/web',
  proxyConfig,
  externalEndpointDependencies: (nextConfig) => {
    const { graphqlEndpoint } = nextConfig.serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
