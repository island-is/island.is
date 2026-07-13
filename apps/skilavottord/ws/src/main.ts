import { bootstrap } from '@island.is/infra-nest-server'
import { BASE_PATH } from '@island.is/skilavottord/consts'

import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'skilavottord-ws',
  // Apollo Server 3 applied CORS to the GraphQL endpoint by default; Apollo
  // Server 4+ removed that, so the same wildcard-origin CORS is applied here.
  enableCors: { path: `${BASE_PATH}/api/graphql`, origin: '*' },
  port: 3333,
  stripNonClassValidatorInputs: false,
})
