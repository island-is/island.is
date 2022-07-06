import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'auth-admin-web',
  appDir: 'apps/auth-admin-web',
  proxyConfig,
  externalEndpointDependencies: process.env.BASE_URL
    ? [process.env.BASE_URL]
    : [],
})
