import { bootstrap, processJob } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { WorkerModule } from './app/worker/worker.module'

const job = processJob()

if (job === 'worker') {
  bootstrap({
    appModule: WorkerModule,
    name: 'university-gateway-worker',
  })
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-university-gateway',
    port: 3380,
    swaggerPath: '/api/swagger',
    openApi,
    enableVersioning: true,
  })
}
