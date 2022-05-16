import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-personal-representative'> => {
  return service('services-personal-representative')
    .namespace('personal-representative')
    .image('services-personal-representative')
    .env({
      DB_HOST: 'postgres-ids.internal',
      DB_REPLICAS_HOST: 'postgres-ids.internal',
      DB_USER: 'servicesauth',
      DB_NAME: 'servicesauth',
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
    .secrets({
      DB_PASS: '/k8s/services-auth/api/DB_PASSWORD',
    })
    .ingress({
      primary: {
        host: {
          dev: 'personal-representative-xrd.internal.dev01.devland.is',
          staging: 'personal-representative-xrd.internal.staging01.devland.is',
          prod: 'personal-representative-xrd.internal.innskra.island.is',
        },
        paths: [
          {
            path: '/',
          },
        ],
        public: false,
      },
      demoALB: {
        host: {
          dev: 'personal-representative-xrd.dev01.devland.is',
          staging: '',
          prod: '',
        },
        paths: [
          {
            path: '/',
          },
        ],
        public: true,
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
