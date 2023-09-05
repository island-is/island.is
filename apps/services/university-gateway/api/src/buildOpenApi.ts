import { buildOpenApi } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/services/university-gateway/src/openapi.yaml', //TODO er þetta ekki vitlaus slóð? á að fara á university-gateway-api
  appModule: AppModule,
  openApi,
})
