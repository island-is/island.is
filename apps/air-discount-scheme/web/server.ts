import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.conf.json'

bootstrap({
  name: 'air-discount-scheme',
  appDir: 'apps/air-discount-scheme/web',
  proxyConfig,
})
