import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'

export const serviceSetup =
  (): ServiceBuilder<'services-auth-personal-representative-public'> => {
    return service('services-auth-personal-representative-public')
      .namespace('personal-representative')
      .image('services-auth-personal-representative-public')
      .db({
        name: 'servicesauth',
      })
      .env({
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
        SYSLUMENN_HOST: {
          dev: 'https://api.syslumenn.is/staging',
          staging: 'https://api.syslumenn.is/staging',
          prod: 'https://api.syslumenn.is',
        },
        SYSLUMENN_TIMEOUT: '10000',
      })
      .secrets({
        SYSLUMENN_USERNAME: '/k8s/services-auth/SYSLUMENN_USERNAME',
        SYSLUMENN_PASSWORD: '/k8s/services-auth/SYSLUMENN_PASSWORD',
      })
      .ingress({
        primary: {
          host: {
            dev: 'personal-representative-public-xrd.internal.dev01.devland.is',
            staging:
              'personal-representative-public-xrd.internal.staging01.devland.is',
            prod: 'personal-representative-public-xrd.internal.innskra.island.is',
          },
          paths: ['/'],
          public: false,
        },
        demo: {
          host: {
            dev: 'personal-representative-public-xrd.dev01.devland.is',
            staging: '',
            prod: '',
          },
          paths: ['/'],
          public: true,
        },
      })
      .readiness('/health/check')
      .liveness('/liveness')
      .resources({
        limits: {
          cpu: '400m',
          memory: '512Mi',
        },
        requests: {
          cpu: '100m',
          memory: '256Mi',
        },
      })
      .replicaCount({
        default: 2,
        min: 2,
        max: 10,
      })
  }
