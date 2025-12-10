import { processJob } from './app/utils'
import '@island.is/infra-tracing'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { AppService } from './app/app.service'

const job = processJob()

if (job === 'energy-fund-import') {
  import('./app/energy-fund-import/energy-fund-import-worker')
    .then((app) => app.energyFundWorker())
    .catch((error) => {
      console.error(
        'Failed to import or execute the energy fund import worker:',
        error,
      )
    })
} else {
  import('./app/grant-import/grant-import-worker')
    .then((app) => app.worker())
    .catch((error) => {
      console.error(
        'Failed to import or execute the cms grant import worker:',
        error,
      )
    })
}
