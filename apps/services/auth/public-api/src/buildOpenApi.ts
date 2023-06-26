import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

try {
  buildOpenApi({
    path: 'apps/services/auth/public-api/src/openapi.yaml',
    appModule: AppModule,
    openApi,
  })
} catch (err) {
  console.error(err)
}
