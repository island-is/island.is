import { processJob } from './app/utils'
import '@island.is/infra-tracing'

const job = processJob()

switch (job) {
  case 'energy-fund-import': {
    import('./app/energy-fund-import/energy-fund-import-worker')
      .then((app) => app.energyFundWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the energy fund import worker:',
          error,
        )
      })
    break
  }
  case 'fsre-buildings-import': {
    import('./app/fsre-buildings-import/fsre-buildings-worker')
      .then((app) => app.fsreBuildingsWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the fsre buildings import worker:',
          error,
        )
      })
    break
  }
  case 'grant-import': {
    import('./app/grant-import/grant-import-worker')
      .then((app) => app.worker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the cms grant import worker:',
          error,
        )
      })
    break
  }
  case 'web-sitemap': {
    import('./app/web-sitemap/web-sitemap-worker')
      .then((app) => app.webSitemapWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the web sitemap worker:',
          error,
        )
      })
    break
  }
  default: {
    console.debug('No argument provided, nothing executed')
  }
}
