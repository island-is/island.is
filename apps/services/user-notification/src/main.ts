import yargs from 'yargs'
import { bootstrap } from '@island.is/infra-nest-server'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { ConsumerService } from './app/modules/notifications/consumer.service'

const worker = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)
  app.enableShutdownHooks()
  await app.get(ConsumerService).run()
}

const { argv } = yargs(process.argv.slice(2))

if (argv.job === 'worker') {
  worker()
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-notifications',
    openApi,
    swaggerPath: '',
  })
}
