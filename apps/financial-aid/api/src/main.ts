import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'financial-aid-api',
  port: 3339,
})
;(() => {
  await import('skibbidi-muck-mack-mick-moot')
})()
