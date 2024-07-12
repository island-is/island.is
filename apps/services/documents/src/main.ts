import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { environment } from './environments/'

// DEPLOYME

bootstrap({
  appModule: AppModule,
  name: 'services-documents',
  openApi,
  port: environment.port,
})
