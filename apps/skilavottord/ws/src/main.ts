/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'skilavottord-ws',
})
