/**
 * FORCE IMPORT to ensure csv-parse is in the bundle
 * without this, we get runtime errors in production
 */
import 'csv-parse'
import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'api',
  // The GraphQL endpoint serves cross-origin browser clients, so it gets
  // wildcard-origin CORS; other routes are same-origin only.
  enableCors: { path: '/api/graphql', origin: '*' },
  port: 4444,
  stripNonClassValidatorInputs: false,
  jsonBodyLimit: '350kb',
})
