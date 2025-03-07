import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const workerSetup = (): ServiceBuilder<'cms-importer-worker'> =>
  service('cms-importer-worker')
    .image('services-cms-importer')
    .namespace('cms-importer')
    .secrets({
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
        '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    })
    .command('node')
    .args('main.js')
    .extraAttributes({
      // Schedule to run daily at 15:00 and midnight.
      dev: { schedule: '0 15,0 * * *' },
      staging: { schedule: '0 15,0 * * *' },
      prod: { schedule: '0 15,0 * * *' },
    })
