import yargs from 'yargs'

import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { WorkerModule } from './app/worker/worker.module'
import { environment } from './environments'
import { openApi } from './openApi'

const { argv } = yargs(process.argv.slice(2))

if (argv.job === 'worker') {
  bootstrap({
    appModule: WorkerModule,
    name: 'sessions-worker',
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
