import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'contentful-entry-tagger-service'> =>
  service('services-contentful-entry-tagger-service')
    .image('services-contentful-entry-tagger')
    .namespace('contentful-entry-tagger')
    .serviceAccount('contentful-entry-tagger')
    .secrets({
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
        '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    })
