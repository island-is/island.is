import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

if (!process.env.THIS_IS_REQUIRED_ENV) {
  throw new Error('Cannot find env THIS_IS_REQUIRED_ENV')
}

bootstrap({
  appModule: AppModule,
  name: 'financial-aid-api',
  port: 3339,
})
