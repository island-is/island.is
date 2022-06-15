import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { MissingSetting } from '../../../../infra/src/dsl/types/input-types'
export const serviceSetup = (): ServiceBuilder<'services-personal-representative'> => {
  return service('services-personal-representative')
    .namespace('personal-representative')
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'personal-representative-xrd.internal.dev01.devland.is',
          staging: 'personal-representative-xrd.internal.staging01.devland.is',
          prod: 'personal-representative-xrd.internal.innskra.island.is',
        },
        paths: ['/'],
        public: false,
      },
      demo: {
        host: {
          dev: 'personal-representative-xrd.dev01.devland.is',
          staging: MissingSetting,
          prod: MissingSetting,
        },
        paths: ['/'],
        public: true,
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .resources({
      limits: {
        cpu: '400m',
        memory: '256Mi',
      },
      requests: {
        cpu: '100m',
        memory: '128Mi',
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
}
