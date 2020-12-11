/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import '@island.is/infra-tracing'
import { bootstrap } from '@island.is/infra-nest-server'

import { config } from './config'

bootstrap({
  name: 'application-system-api',
  appModule: config.appModule,
  openApi: config.openApi.document,
})
