import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'university-gateway',
  port: 3380, //TODO er þetta rétt port? þetta er sama og backend notar
  openApi,
  swaggerPath: 'api/swagger',
  enableVersioning: true,
})
