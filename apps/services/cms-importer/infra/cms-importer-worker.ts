import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const workerSetup = (): ServiceBuilder<'cms-importer-worker'> =>
  service('cms-importer-worker')
    .image('services-cms-importer')
    .namespace('cms-importer')
    .serviceAccount('cms-importer')
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

export const energyFundImportSetup =
  (): ServiceBuilder<'cms-importer-energy-fund-import'> =>
    service('cms-importer-energy-fund-import')
      .image('services-cms-importer')
      .namespace('cms-importer')
      .serviceAccount('cms-importer')
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
      .serviceAccount('cms-importer')
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

export const webSitemapImportSetup =
  (): ServiceBuilder<'cms-importer-web-sitemap'> =>
    service('cms-importer-web-sitemap')
      .image('services-cms-importer')
      .namespace('cms-importer')
      .serviceAccount('cms-importer-web-sitemap')
      .env({
        S3_BUCKET: {
          dev: 'island-is-dev-cms-importer',
          staging: 'island-is-staging-cms-importer',
          prod: 'island-is-prod-cms-importer',
        },
      })
      .secrets({
        CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
          '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
      })
      .command('node')
      .args('main.cjs', '--job', 'web-sitemap')
      .extraAttributes({
        dev: { schedule: '*/1 * * * *' },
        staging: { schedule: '0 * * * *' },
        prod: { schedule: '0 * * * *' },
      })
