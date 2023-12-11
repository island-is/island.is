import { buildOpenApi } from '@island.is/infra-nest-server'
import { openApi } from './openApi'
import { AppModule } from './app/app.module'


buildOpenApi({
  path: 'apps/services/user-notification/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
