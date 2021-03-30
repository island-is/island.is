import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/icelandic-names-registry/backend/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
