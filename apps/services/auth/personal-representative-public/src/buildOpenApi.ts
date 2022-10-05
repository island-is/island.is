import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/services/auth/personal-representative-public/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
