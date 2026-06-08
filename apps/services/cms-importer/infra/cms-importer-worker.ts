import {
  service,
  ServiceBuilder,
  scheduledJob,
  ScheduledJobBuilder,
} from '../../../../infra/src/dsl/dsl'

export const workerSetup = (): ScheduledJobBuilder<'cms-importer-worker'> =>
  scheduledJob('cms-importer-worker')
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
    .schedule({
      // Schedule to run daily at 15:00 and midnight, every 3 hours on dev.
      dev: '0 */3 * * *',
      staging: '0 15,0 * * *',
      prod: '0 15,0 * * *',
    })

export const energyFundImportSetup =
  (): ScheduledJobBuilder<'cms-importer-energy-fund-import'> =>
    scheduledJob('cms-importer-energy-fund-import')
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
      .schedule({
        dev: '0 8 * * 1',
        staging: '0 8 * * 1',
        prod: '0 8 * * 1',
      })
      .args('main.cjs')

export const fsreBuildingsImportSetup =
  (): ScheduledJobBuilder<'cms-importer-fsre-buildings-import'> =>
    scheduledJob('cms-importer-fsre-buildings-import')
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
      .schedule({
        dev: '0 8 * * 1',
        staging: '0 8 * * 1',
        prod: '0 8 * * 1',
      })
      .args('main.cjs')

export const webSitemapImportSetup =
  (): ScheduledJobBuilder<'cms-importer-web-sitemap'> =>
    scheduledJob('cms-importer-web-sitemap')
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
<<<<<<< HEAD
      .extraAttributes({
        dev: { schedule: '0 0 * * *' },
        staging: { schedule: '0 0 * * 0' },
        prod: { schedule: '0 */3 * * *' },
=======
      .schedule({
        dev: '0 3 */2 * *',
        staging: '0 4 * * 0',
        prod: '0 0 * * *',
>>>>>>> af7a6e7a30 (feat(infra): add scheduledJob() DSL builder for CronJob services (#22412))
      })

export const cmsCleanupSetup =
  (): ScheduledJobBuilder<'cms-importer-cms-cleanup'> =>
    scheduledJob('cms-importer-cms-cleanup')
      .image('services-cms-importer')
      .namespace('cms-importer')
      .secrets({
        CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
          '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
      })
      .command('node')
      .args('main.cjs', '--job', 'cms-cleanup')
      .schedule({
        dev: '0 0 * * 0',
        staging: '0 0 * * 0',
        prod: '0 0 * * 0',
      })
