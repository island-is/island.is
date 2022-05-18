import getConfig from 'next/config'
import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'air-discount-scheme',
  appDir: 'apps/air-discount-scheme/web',
  proxyConfig,
  externalEndpointDependencies: () => {
    const { serverRuntimeConfig } = getConfig()
    const { graphqlEndpoint, apiUrl } = serverRuntimeConfig
    return [graphqlEndpoint, apiUrl]
  },
})
