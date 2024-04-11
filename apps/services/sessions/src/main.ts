import ip3country from 'ip3country'

import { bootstrap, processJob } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { WorkerModule } from './app/worker/worker.module'
import { environment } from './environments'
import { openApi } from './openApi'

const job = processJob()
const beforeAppInit = async () => {
  ip3country.init()
}

if (job === 'worker') {
  bootstrap({
    appModule: WorkerModule,
    name: 'sessions-worker',
    beforeAppInit,
  })
} else if (job === 'cleanup') {
  import('./app/cleanup/cleanup-worker')
    .then((app) => app.worker())
    .catch((error) => {
      console.error('Failed to import or execute the cleanup worker:', error)
    })
} else {
  bootstrap({
    appModule: AppModule,
    name: 'sessions',
    beforeAppInit,
    openApi,
    port: environment.port,
    enableVersioning: true,
  })
}
