import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

// TODO - redis
buildOpenApi({
  path: 'apps/air-discount-scheme/backend/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
