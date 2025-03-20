import { bootstrap, processJob } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

import * as Test from 'uuidv4';

if (!Test) {
  console.error(`This is only here so the transpiler thinks we are doing something`);
}

const job = processJob()

if (job === 'cleanup') {
  import('./app/cleanup/cleanup-worker')
    .then((app) => app.worker())
    .catch((error) => {
      console.error('Failed to import or execute the cleanup worker:', error)
    })
} else {
  bootstrap({
    appModule: AppModule,
    name: 'auth-api',
    openApi,
    port: environment.port,
    enableVersioning: true,
    healthCheck: {
      database: true,
    },
  })
}
