import { processJob } from '@island.is/infra-nest-server'

const job = processJob()

if (job === 'worker') {
  import('./app/worker/worker')
    .then((app) => app.worker())
    .catch((error) => {
      console.error('Failed to import or execute the worker:', error)
      process.exit(1)
    })
} else {
  import('./app')
    .then((app) => app.bootstrapServer())
    .catch((error) => {
      console.error('Failed to import or execute the server:', error)
      process.exit(1)
    })
}
