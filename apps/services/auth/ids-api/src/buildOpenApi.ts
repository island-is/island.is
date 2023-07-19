import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/services/auth/ids-api/src/openapi.yml',
  appModule: AppModule,
  openApi,
  enableVersioning: true,
})
