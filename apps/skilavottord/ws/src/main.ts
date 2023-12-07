import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'skilavottord-ws',
  port: 3339,
  stripNonClassValidatorInputs: false,
})
