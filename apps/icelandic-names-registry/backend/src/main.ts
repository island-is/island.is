import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'icelandic-names-registry-backend',
  port: 4239,
  swaggerPath: 'api/swagger',
  openApi,
})
