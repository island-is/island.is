import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'contentful-entry-tagger-service'> =>
  service('contentful-entry-tagger-service')
    .image('contentful-entry-tagger')
    .namespace('contentful-entry-tagger')
    .serviceAccount('contentful-entry-tagger')
    .secrets({
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:
        '/k8s/contentful-entry-tagger/CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
    })
    .resources({
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
      limits: {
        cpu: '400m',
        memory: '1024Mi',
      },
    })
