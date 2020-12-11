import '@island.is/infra-tracing'
import { AppModule } from './app/app.module'
import { bootstrap } from '@island.is/infra-nest-server'

export const config = {
  appModule: AppModule,
  name: 'api',
  port: 4444,
}

bootstrap(config)
