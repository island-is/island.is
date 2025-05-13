import { processJob } from './app/utils'

const job = processJob()

if (job === 'energy-fund-import') {
  import('./app/energy-fund-import/energy-fund-import-worker')
    .then((app) => app.energyFundWorker())
    .catch((error) => {
      console.error(
        'Failed to import or execute the energy fund import worker:',
        error,
      )
    })
} else {
  import('./app/grant-import/grant-import-worker')
    .then((app) => app.worker())
    .catch((error) => {
      console.error(
        'Failed to import or execute the cms grant import worker:',
        error,
      )
    })
}
