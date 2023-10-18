import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { environment } from './environments'

bootstrap({
  appModule: AppModule,
  name: 'services-user-profile',
  openApi,
  port: environment.port,
  enableVersioning: true,
})
