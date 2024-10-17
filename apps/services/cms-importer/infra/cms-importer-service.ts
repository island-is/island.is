import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'cms-importer-service'> =>
  service('cms-importer-service')
    .image('services-cms-importer')
    .namespace('cms-importer')
    .serviceAccount('cms-importer') //todo
    .secrets({
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
        '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    })
