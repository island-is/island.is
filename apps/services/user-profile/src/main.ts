import { logger } from '@island.is/logging'
import { bootstrap, processJob } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

if (processJob() === 'metrics') {
  import('./metrics')
    .then((app) => app.metrics())
    .catch(() => {
      logger.error(
        'Metrics job failed; check collector configuration and database availability',
      )
      process.exitCode = 1
    })
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-user-profile',
    openApi,
    port: environment.port,
    enableVersioning: true,
  })
}
