import { bootstrap } from '@island.is/infra-nest-server'
import { BASE_PATH } from '@island.is/skilavottord/consts'

import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'skilavottord-ws',
  // The GraphQL endpoint serves cross-origin browser clients, so it gets
  // wildcard-origin CORS; other routes are same-origin only.
  enableCors: { path: `${BASE_PATH}/api/graphql`, origin: '*' },
  port: 3333,
  stripNonClassValidatorInputs: false,
})
