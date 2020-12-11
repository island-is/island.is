/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

export const config = {
  appModule: AppModule,
  name: 'skilavottord-ws',
  port: 3333,
  // port: 4242,
  // port: 4200,
}

bootstrap(config)
