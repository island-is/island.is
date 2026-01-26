import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const workerSetup = (): ServiceBuilder<'cms-importer-worker'> =>
  service('cms-importer-worker')
    .image('services-cms-importer')
    .namespace('cms-importer')
    .env({
      RANNIS_GRANTS_URL: {
        dev: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
        staging: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
        prod: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
      },
    })
    .secrets({
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
        '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    })
    .command('node')
    .args('main.cjs', '--job', 'grant-import')
    .extraAttributes({
      // Schedule to run daily at 15:00 and midnight, every 3 hours on dev.
      dev: { schedule: '0 */3 * * *' },
      staging: { schedule: '0 15,0 * * *' },
      prod: { schedule: '0 15,0 * * *' },
    })

export const energyFundImportSetup =
  (): ServiceBuilder<'cms-importer-energy-fund-import'> =>
    service('cms-importer-energy-fund-import')
      .image('services-cms-importer')
      .namespace('cms-importer')
      .env({
        RANNIS_GRANTS_URL: {
          dev: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
          staging: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
          prod: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
        },
      })
      .secrets({
        CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
          '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
      })
      .command('node')
      .args('main.cjs')

export const fsreBuildingsImportSetup =
  (): ServiceBuilder<'cms-importer-fsre-buildings-import'> =>
    service('cms-importer-fsre-buildings-import')
      .image('services-cms-importer')
      .namespace('cms-importer')
      .env({
        RANNIS_GRANTS_URL: {
          dev: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
          staging: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
          prod: 'https://sjodir.rannis.is/statistics/fund_schedule.php',
        },
      })
      .secrets({
        CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
          '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
      })
      .command('node')
      .args('main.cjs')
