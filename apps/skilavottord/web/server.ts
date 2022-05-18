import getConfig from 'next/config'

import { bootstrap } from '@island.is/infra-next-server'

import proxyConfig from './proxy.conf.json'

bootstrap({
  name: 'skilavottord',
  appDir: 'apps/skilavottord/web',
  proxyConfig,
  externalEndpointDependencies: () => {
    const { serverRuntimeConfig } = getConfig()
    const { graphqlEndpoint } = serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
