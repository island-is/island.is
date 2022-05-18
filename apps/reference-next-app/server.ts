import getConfig from 'next/config'

import { bootstrap } from '@island.is/infra-next-server'

bootstrap({
  name: 'reference-next-app',
  appDir: 'apps/reference-next-app',
  externalEndpointDependencies: () => {
    const { serverRuntimeConfig } = getConfig()
    const { graphqlEndpoint } = serverRuntimeConfig
    return [graphqlEndpoint]
  },
})
