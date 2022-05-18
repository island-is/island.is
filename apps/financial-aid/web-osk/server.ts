import getConfig from 'next/config'
import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'financial-aid',
  appDir: 'apps/financial-aid/web-osk',
  proxyConfig,
  externalEndpointDependencies: () => {
    const { serverRuntimeConfig } = getConfig()
    const { graphqlEndpoint, apiUrl } = serverRuntimeConfig
    return [graphqlEndpoint, apiUrl]
  },
})
