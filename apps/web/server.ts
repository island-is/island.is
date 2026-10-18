import {
  bootstrap,
  buildContentSecurityPolicy,
  buildDatadogCspReportUri,
} from '@island.is/infra-next-server'

import { getServerRuntimeEnv } from './environments/runtimeEnvironment'
import proxyConfig from './proxy.config.json'

const cspReportUri = buildDatadogCspReportUri({ service: 'web' })

bootstrap({
  name: 'web',
  appDir: 'apps/web',
  proxyConfig,
  csp: (nonce) =>
    buildContentSecurityPolicy(nonce, { reportUri: cspReportUri }),
  externalEndpointDependencies: () => {
    const { graphqlUrl } = getServerRuntimeEnv()
    return [graphqlUrl]
  },
})
