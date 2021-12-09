/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrap } from '@island.is/infra-nest-server'
import { NestFactory } from '@nestjs/core'
import yargs from 'yargs'

import { AppModule } from './app/app.module'
import { ApplicationLifeCycleService } from './app/modules/application/application-lifecycle.service'
import { openApi } from './openApi'

const worker = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)
  app.enableShutdownHooks()
  await app.get(ApplicationLifeCycleService).run()
}

const { argv } = yargs(process.argv.slice(2))

if (argv.job === 'worker') {
  worker()
} else {
  bootstrap({
    appModule: AppModule,
    name: 'application-system-api',
    openApi,
  })
}
