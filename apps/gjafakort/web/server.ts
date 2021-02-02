import { bootstrap } from '@island.is/infra-next-server'
import proxyConfig from './proxy.conf.json'

bootstrap({
  name: 'gjafakort',
  appDir: 'apps/gjafakort/web',
  proxyConfig,
})
