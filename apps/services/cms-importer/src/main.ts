import { processJob } from './app/utils'
import '@island.is/infra-tracing'

const job = processJob()

switch (job) {
  case 'energy-fund-import': {
    import('./app/organizations/energy-fund/jobs/energy-fund/energy-fund.worker')
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
    import(
      './app/organizations/fsre-buildings/jobs/fsre-buildings/fsre-buildings.worker'
    )
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
    import('./app/grants/jobs/grant-import/grant-import-worker')
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
    import(
      './app/contentful-maintenance/jobs/web-sitemap/web-sitemap-worker'
    )
      .then((app) => app.webSitemapWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the web sitemap worker:',
          error,
        )
      })
    break
  }
  case 'cms-cleanup': {
    import('./app/contentful-maintenance/jobs/cms-cleanup/cms-cleanup-worker')
      .then((app) => app.cmsCleanupWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the cms cleanup worker:',
          error,
        )
      })
    break
  }
  case 'lyfjastofnun-instructions-import': {
    import(
      './app/organizations/lyfjastofnun/jobs/instructions/instructions.worker'
    )
      .then((app) => app.lyfjastofnunInstructionsImportWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the lyfjastofnun instructions import worker:',
          error,
        )
      })
    break
  }
  case 'lyfjastofnun-lists-import': {
    import('./app/organizations/lyfjastofnun/jobs/lists/lists.worker')
      .then((app) => app.lyfjastofnunListsImportWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the lyfjastofnun lists import worker:',
          error,
        )
      })
    break
  }
  case 'lyfjastofnun-news-import': {
    import('./app/organizations/lyfjastofnun/jobs/news/news.worker')
      .then((app) => app.lyfjastofnunNewsImportWorker())
      .catch((error) => {
        console.error(
          'Failed to import or execute the lyfjastofnun news import worker:',
          error,
        )
      })
    break
  }
  default: {
    console.debug('No argument provided, nothing executed')
  }
}
