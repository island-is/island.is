import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
console.log(`Dummy change`)
bootstrap({
  appModule: AppModule,
  name: 'api',
  port: 4444,
  stripNonClassValidatorInputs: false,
})
