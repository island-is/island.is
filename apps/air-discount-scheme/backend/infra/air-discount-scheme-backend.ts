import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { Base, Client, NationalRegistry } from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'air-discount-scheme-backend'> =>
  service('air-discount-scheme-backend')
    .image('air-discount-scheme-backend')
    .namespace('air-discount-scheme')
    .serviceAccount('air-discount-scheme-backend')
    .secrets({
      ICELANDAIR_API_KEY: '/k8s/air-discount-scheme/backend/ICELANDAIR_API_KEY',
      MYFLUG_API_KEY: '/k8s/air-discount-scheme/backend/MYFLUG_API_KEY',
      ERNIR_API_KEY: '/k8s/air-discount-scheme/backend/ERNIR_API_KEY',
      NORLANDAIR_API_KEY: '/k8s/air-discount-scheme/backend/NORLANDAIR_API_KEY',
      NATIONAL_REGISTRY_PASSWORD:
        '/k8s/air-discount-scheme/backend/NATIONAL_REGISTRY_PASSWORD',
      NATIONAL_REGISTRY_USERNAME:
        '/k8s/air-discount-scheme/backend/NATIONAL_REGISTRY_USERNAME',
      NATIONAL_REGISTRY_URL:
        '/k8s/air-discount-scheme/backend/NATIONAL_REGISTRY_URL',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/air-discount-scheme-backend/VEGAGERDIN_IDS_CLIENTS_ADS_SECRET',
    })
    .xroad(Base, Client, NationalRegistry)
    .env({
      ENVIRONMENT: {
        dev: 'dev',
        staging: 'staging',
        prod: 'prod',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_CLIENT_ID: '@vegagerdin.is/clients/air-discount-scheme',
    })
    .db()
    .migrations()
    .redis({
      host: {
        dev: 'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        staging:
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        prod: 'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: ['loftbru', 'loftbru-cf'],
          staging: ['loftbru', 'loftbru-cf'],
          prod: 'loftbru',
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
        paths: ['/api/swagger', '/api/public'],
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .replicaCount({
      min: 2,
      max: 10,
      default: 2,
      scalingMagicNumber: 20,
    })
    .grantNamespaces('islandis')
