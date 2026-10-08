import {
  bootstrap,
  buildContentSecurityPolicy,
  buildDatadogCspReportUri,
} from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

const cspReportUri = buildDatadogCspReportUri({ service: 'auth-admin-web' })

bootstrap({
  name: 'auth-admin-web',
  appDir: 'apps/auth-admin-web',
  proxyConfig,
  csp: (nonce) =>
    buildContentSecurityPolicy(nonce, { reportUri: cspReportUri }),
  externalEndpointDependencies: process.env.BASE_URL
    ? [process.env.BASE_URL]
    : [],
})
