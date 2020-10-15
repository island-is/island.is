import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/judicial-system/backend/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
