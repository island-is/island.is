import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/services/temporary-voter-registry-api/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
