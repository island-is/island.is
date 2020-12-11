import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

export const config = {
  appModule: AppModule,
  name: 'judicial-system-api',
  port: 3333,
}

bootstrap(config)
