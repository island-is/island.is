import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

import yargs from 'yargs'

const { argv } = yargs(process.argv.slice(2))

if (argv.job === 'worker') {
  import('./app/worker/worker').then((app) => {
    app.worker()
  })
} else {
  bootstrap({
    appModule: AppModule,
    name: 'activities',
    openApi,
    port: environment.port,
    enableVersioning: true,
  })
}
