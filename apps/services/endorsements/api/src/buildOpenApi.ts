import { buildOpenApi } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/services/endorsements/api/src/openapi.yml',
  appModule: AppModule,
  openApi,
})
