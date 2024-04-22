import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { environment } from './environments'

bootstrap({
  appModule: AppModule,
  name: 'personal-representative',
  openApi,
  port: environment.port,
  healthCheck: {
    database: true,
  },
})
