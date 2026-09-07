import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'financial-aid-api',
  // The GraphQL endpoint serves cross-origin browser clients, so it gets
  // wildcard-origin CORS; other routes are same-origin only.
  enableCors: { path: '/api/graphql', origin: '*' },
  port: 3339,
})
