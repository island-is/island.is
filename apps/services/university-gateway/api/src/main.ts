import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'university-gateway',
  port: 3380,
  openApi,
  swaggerPath: 'api/swagger',
  enableVersioning: true,
})
