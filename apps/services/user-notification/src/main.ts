import { bootstrap, processJob } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { NotificationsWorkerService } from './app/modules/notifications/notificationsWorker/notificationsWorker.service'
import { birthdayFlag } from './utils'

const job = processJob()
const birthday = birthdayFlag()

if (job === 'cleanup') {
  import('./cleanup').then((app) => app.cleanup())
} else if (birthday && job === 'worker') {
  import('./birthday').then((app) => app.birthday())
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-user-notifications',
    openApi,
    enableVersioning: true,
    healthCheck: {
      database: true,
    },
  }).then(async ({ app }) => {
    if (job === 'worker') {
      const notificationsWorkerService = await app.resolve(
        NotificationsWorkerService,
      )
      await notificationsWorkerService.run()
    }
  })
}
