import { bootstrap, processJob } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { environment } from './environments'

const job = processJob()

if (job === 'worker') {
  import('./worker').then((app) => app.worker())
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-user-profile',
    openApi,
    port: environment.port,
    enableVersioning: true,
  })
}
