import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'university-gateway',
  openApi,
  port: environment.port,
  swaggerPath: '/swagger',
  enableVersioning: true,
})
