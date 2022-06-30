import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'services-personal-representative-public'> => {
  return service('services-personal-representative-public')
    .namespace('personal-representative')
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      DB_REPLICAS_HOST: {
        dev:
          'dev-vidspyrna-aurora.cluster-ro-c6cxecmrvlpq.eu-west-1.rds.amazonaws.com',
        staging: '',
        prod: '',
      },
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
