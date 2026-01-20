import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'

export const bootstrapServer = () =>
  bootstrap({
    appModule: AppModule,
    name: 'services-form-system-api',
    openApi,
    swaggerPath: 'api/swagger',
    port: 3434,
  })
