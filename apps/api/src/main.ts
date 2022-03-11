import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
// dummy change
bootstrap({
  appModule: AppModule,
  name: 'api',
  port: 4444,
  stripNonClassValidatorInputs: false,
})
