import { bootstrap } from '@island.is/infra-next-server'

import proxyConfig from './proxy.conf.json'
import { getServerRuntimeEnv } from './environments/runtimeEnvironment'

bootstrap({
  name: 'skilavottord',
  appDir: 'apps/skilavottord/web',
  proxyConfig,
  externalEndpointDependencies: () => {
    const { graphqlEndpoint } = getServerRuntimeEnv()
    return [graphqlEndpoint]
  },
})
