import { bootstrap } from '@island.is/infra-next-server'

import { getServerRuntimeEnv } from './environments/runtimeEnvironment'
import defaultProxyConfig from './proxy.config.json'

// The local proxy sends /api to the api server. It follows INTERNAL_API_URL
// when that is set, so a local stack on non-default ports (e.g. an e2e run
// with its own api) is reached by both the proxy and the server-side calls.
// Deployed environments never enable the proxy, so this does not affect them.
const { INTERNAL_API_URL } = process.env
const proxyConfig = INTERNAL_API_URL
  ? Object.fromEntries(
      Object.entries(defaultProxyConfig).map(([path, options]) => [
        path,
        { ...options, target: INTERNAL_API_URL },
      ]),
    )
  : defaultProxyConfig

bootstrap({
  name: 'judicial-system',
  appDir: 'apps/judicial-system/web',
  proxyConfig,
  externalEndpointDependencies: () => {
    const { graphqlEndpoint, apiUrl } = getServerRuntimeEnv()
    return [graphqlEndpoint, apiUrl]
  },
})
