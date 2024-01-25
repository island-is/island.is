import { bootstrap, processJob } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'

const job = processJob()

if (job === 'cleanup') {
  import('./cleanup').then((app) => app.cleanup())
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-user-notifications',
    openApi,
    enableVersioning: true,
  })
}
