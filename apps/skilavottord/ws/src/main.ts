/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { environment } from './environments'

bootstrap({
  appModule: AppModule,
  name: 'skilavottord-ws',
 // port: 4242,
})
