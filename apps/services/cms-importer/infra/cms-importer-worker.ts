import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const workerSetup = (): ServiceBuilder<'cms-importer-worker'> =>
  service('cms-importer-worker')
    .image('services-cms-worker')
    .namespace('cms-importer')
    .serviceAccount('cms-importer-worker') //todo
    .secrets({
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
        '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    })
    .command('node')
    .args('main.js')
    .extraAttributes({
      // Schedule to run daily at 15:00 and midnight.
      dev: { schedule: '0 15 * * *' },
      staging: { schedule: '0 15 * * *' },
      prod: { schedule: '0 15 * * *' },
    })
