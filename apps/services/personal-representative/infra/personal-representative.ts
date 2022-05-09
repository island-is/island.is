import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'personal-representative'> => {
  return service('personal-representative')
    .namespace('identity-server')
    .env({
      IDS_ISSUER: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
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
      demoALB: {
        host: {
          dev: 'personal-representative-xrd.dev01.devland.is',
          staging: '',
          prod: '',
        },
        paths: ['/'],
        public: true,
      }
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
