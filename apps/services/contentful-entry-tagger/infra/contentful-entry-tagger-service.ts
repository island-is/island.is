import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup =
  (): ServiceBuilder<'contentful-entry-tagger-service'> =>
    service('contentful-entry-tagger-service')
      .image('services-contentful-entry-tagger')
      .namespace('contentful-entry-tagger')
      .serviceAccount('contentful-entry-tagger')
      .secrets({
        CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
          '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
        CONTENTFUL_REQUEST_TOKEN:
          '/k8s/contentful-entry-tagger/CONTENTFUL_REQUEST_TOKEN',
      })
      .ingress({
        primary: {
          host: {
            dev: 'contentful-entry-tagger-service',
            staging: 'contentful-entry-tagger-service',
            prod: 'contentful-entry-tagger-service',
          },
          paths: ['/'],
        },
      })
      .liveness('/liveness')
      .readiness('/readiness')
