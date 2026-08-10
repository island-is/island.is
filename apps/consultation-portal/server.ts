import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config'
import { getServerRuntimeEnv } from './environments/runtimeEnvironment'

bootstrap({
  name: 'consultation-portal',
  appDir: 'apps/consultation-portal',
  turbopack: true,
  proxyConfig,
  externalEndpointDependencies: () => {
    const { graphqlEndpoint } = getServerRuntimeEnv()
    return [graphqlEndpoint]
  },
})
