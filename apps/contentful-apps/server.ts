import { bootstrap } from '@island.is/infra-next-server'

import proxyConfig from './proxy.config.json'

bootstrap({
  name: 'contentful-apps',
  appDir: 'apps/contentful-apps',
  proxyConfig,
})
