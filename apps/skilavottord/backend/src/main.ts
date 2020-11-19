import '@island.is/infra-tracing'
import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'

//import { environment } from './environments'

bootstrap({
  appModule: AppModule,
  name: 'skilavottord-backend',
  port: 3344,
  openApi,
})
