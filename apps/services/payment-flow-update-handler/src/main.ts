import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'services-payment-flow-update-handler',
})
