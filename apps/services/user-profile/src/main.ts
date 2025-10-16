import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'
//hi
bootstrap({
  appModule: AppModule,
  name: 'services-user-profile',
  openApi,
  port: environment.port,
  enableVersioning: true,
})
