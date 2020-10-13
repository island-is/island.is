import '@island.is/infra-tracing'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'services-user-profile',
  openApi
})
