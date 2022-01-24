import yargs from 'yargs'
import { bootstrap } from '@island.is/infra-nest-server'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { NotificationsWorkerService } from './app/modules/notifications/notificationsWorker.service'

const worker = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)
  app.enableShutdownHooks()
  await app.get(NotificationsWorkerService).run()
}

const { argv } = yargs(process.argv.slice(2))

if (argv.job === 'worker') {
  worker()
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-user-notifications',
    openApi,
  })
}
