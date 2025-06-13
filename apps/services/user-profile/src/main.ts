import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'
const k = 8 // dummy

bootstrap({
  appModule: AppModule,
  name: 'services-user-profile',
  openApi,
  port: environment.port,
  enableVersioning: true,
})
