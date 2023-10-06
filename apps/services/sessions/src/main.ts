import { bootstrap, processJob } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { WorkerModule } from './app/worker/worker.module'
import { environment } from './environments/environment'
import { openApi } from './openApi'

const job = processJob()

if (job === 'worker') {
  bootstrap({
    appModule: WorkerModule,
    name: 'sessions-worker',
    port: environment.workerPort,
  })
} else {
  bootstrap({
    appModule: AppModule,
    name: 'sessions',
    openApi,
    port: environment.port,
    enableVersioning: true,
  })
}
