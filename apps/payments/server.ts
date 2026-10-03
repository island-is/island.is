import {
  bootstrap,
  buildContentSecurityPolicy,
  buildDatadogCspReportUri,
} from '@island.is/infra-next-server'
import { getServerRuntimeEnv } from './environments/runtimeEnvironment'
import proxyConfig from './proxy.config.json'

const cspReportUri = buildDatadogCspReportUri({ service: 'payments' })

bootstrap({
  name: 'payments',
  appDir: 'apps/payments',
  proxyConfig,
  csp: (nonce) =>
    buildContentSecurityPolicy(nonce, { reportUri: cspReportUri }),
  externalEndpointDependencies: () => {
    const { graphqlEndpoint, apiUrl } = getServerRuntimeEnv()
    return [graphqlEndpoint, apiUrl]
  },
})
