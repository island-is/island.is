import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
export const serviceSetup = (): ServiceBuilder<'contentful-apps'> =>
  service('contentful-apps')
    .image('contentful-apps')
    .namespace('contentful-apps')
    .serviceAccount('contentful-apps')
    .ingress({
      primary: {
        host: {
          dev: 'contentful-apps',
          staging: 'contentful-apps',
          prod: 'contentful-apps',
        },
        paths: ['/'],
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
      requests: {
        cpu: '50m',
        memory: '128Mi',
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
