import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
// Dummy change
bootstrap({
  appModule: AppModule,
  name: 'api',
  port: 4444,
  stripNonClassValidatorInputs: false,
  jsonBodyLimit: '300kb',
})
