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
  // Apollo Server 3 applied CORS to the GraphQL endpoint by default; Apollo
  // Server 4+ removed that, so the same wildcard-origin CORS is applied here.
  enableCors: { origin: '*' },
  port: 4444,
  stripNonClassValidatorInputs: false,
  jsonBodyLimit: '350kb',
})
