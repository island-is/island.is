import { bootstrap, processJob } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { NotificationsWorkerService } from './app/modules/notifications/notificationsWorker/notificationsWorker.service'
import { EmailWorkerService } from './app/modules/notifications/notificationsWorker/emailWorker.service'
import { SmsWorkerService } from './app/modules/notifications/notificationsWorker/smsWorker.service'
import { PushWorkerService } from './app/modules/notifications/notificationsWorker/pushWorker.service'
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
      const emailWorkerService = await app.resolve(EmailWorkerService)
      const smsWorkerService = await app.resolve(SmsWorkerService)
      const pushWorkerService = await app.resolve(PushWorkerService)

      await Promise.all([
        notificationsWorkerService.run(),
        emailWorkerService.run(),
        smsWorkerService.run(),
        pushWorkerService.run(),
      ])
    }
  })
}
