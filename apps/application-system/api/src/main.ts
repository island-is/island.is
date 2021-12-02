/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { PruningService } from './app/modules/application/application-pruning.service'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'application-system-api',
  openApi,
  jobs: {
    async job({ app, args }) {
      const argv = args.option('applicationLifcycle', {
        description: 'Run the application lifecycle',
        type: 'string',
      }).argv
      if (argv.applicationLifecycle) {
        app.enableShutdownHooks()
        await app.get(PruningService).run()
      }
    },
  },
})
