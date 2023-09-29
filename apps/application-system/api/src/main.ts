import { processJob } from '@island.is/infra-nest-server'

const job = processJob()

if (job === 'worker') {
  import('./worker').then((app) => {
    app.worker()
  })
} else {
  import('./app').then((app) => {
    app.bootstrapServer()
  })
}
