import {
  bootstrap,
  buildContentSecurityPolicy,
  buildDatadogCspReportUri,
} from '@island.is/infra-next-server'
import proxyConfig from './proxy.config'
import { getServerRuntimeEnv } from './environments/runtimeEnvironment'

const cspReportUri = buildDatadogCspReportUri({
  service: 'consultation-portal',
})

bootstrap({
  name: 'consultation-portal',
  appDir: 'apps/consultation-portal',
  proxyConfig,
  csp: (nonce) =>
    buildContentSecurityPolicy(nonce, { reportUri: cspReportUri }),
  externalEndpointDependencies: () => {
    const { graphqlEndpoint } = getServerRuntimeEnv()
    return [graphqlEndpoint]
  },
})
