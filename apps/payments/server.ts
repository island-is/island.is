import {
  bootstrap,
  buildContentSecurityPolicy,
} from '@island.is/infra-next-server'
import { getServerRuntimeEnv } from './environments/runtimeEnvironment'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'payments',
  appDir: 'apps/payments',
  turbopack: true,
  proxyConfig,
  csp: buildContentSecurityPolicy,
  externalEndpointDependencies: () => {
    const { graphqlEndpoint, apiUrl } = getServerRuntimeEnv()
    return [graphqlEndpoint, apiUrl]
  },
})
