import { bootstrap } from '@island.is/infra-next-server'

import { getServerRuntimeEnv } from './environments/runtimeEnvironment'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'web',
  appDir: 'apps/web',
  proxyConfig,
  externalEndpointDependencies: () => {
    const { graphqlUrl } = getServerRuntimeEnv()
    return [graphqlUrl]
  },
})
