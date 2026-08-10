import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'
import { getServerRuntimeEnv } from './environments/runtimeEnvironment'

bootstrap({
  name: 'financial-aid',
  appDir: 'apps/financial-aid/web-osk',
  turbopack: true,
  proxyConfig,
  externalEndpointDependencies: () => {
    const { graphqlEndpoint } = getServerRuntimeEnv()
    return [graphqlEndpoint]
  },
})
