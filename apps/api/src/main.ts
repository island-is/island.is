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
  port: 4444,
  stripNonClassValidatorInputs: false,
  jsonBodyLimit: '350kb',
})

// Intentional no-op touch so the deploy-feature pipeline picks up an
// api change alongside the web-only header nav work on this branch.
