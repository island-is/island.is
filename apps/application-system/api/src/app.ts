import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

// Bootstrap
export const bootstrapServer = () => {
  bootstrap({
    appModule: AppModule,
    name: 'application-system-api',
    openApi,
  })
}