import {
  CodeOwners,
  json,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  Disability,
  DrivingLicense,
  Firearm,
  Hunting,
} from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'license-api'> =>
  service('license-api')
    .namespace('license-api')
    .serviceAccount('license-api')
    .codeOwner(CodeOwners.Hugsmidjan)
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      LICENSE_SERVICE_REDIS_NODES: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
        ]),
      },
      HUNTING_LICENSE_PASS_TEMPLATE_ID: {
        dev: '1da72d52-a93a-4d0f-8463-1933a2bd210b',
        staging: '1da72d52-a93a-4d0f-8463-1933a2bd210b',
        prod: 'd4ecf781-3764-4063-a4e1-9c3e17cebfba',
      },
    })
    .secrets({
      SMART_SOLUTIONS_API_URL: '/k8s/api/SMART_SOLUTIONS_API_URL',
      RLS_PKPASS_API_KEY: '/k8s/api/RLS_PKPASS_API_KEY',
      VE_PKPASS_API_KEY: '/k8s/api/VE_PKPASS_API_KEY',
      TR_PKPASS_API_KEY: '/k8s/api/TR_PKPASS_API_KEY',
      UST_PKPASS_API_KEY: '/k8s/api/UST_PKPASS_API_KEY',
      RLS_OPEN_LOOKUP_API_KEY: '/k8s/api/RLS_OPEN_LOOKUP_API_KEY',
      MACHINE_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/MACHINE_LICENSE_PASS_TEMPLATE_ID',
      ADR_LICENSE_PASS_TEMPLATE_ID: '/k8s/api/ADR_LICENSE_PASS_TEMPLATE_ID',
      DRIVING_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/DRIVING_LICENSE_PASS_TEMPLATE_ID',
      FIREARM_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/FIREARM_LICENSE_PASS_TEMPLATE_ID',
      DISABILITY_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/DISABILITY_LICENSE_PASS_TEMPLATE_ID',
      DISABILITY_LICENSE_FETCH_TIMEOUT:
        '/k8s/api/DISABILITY_LICENSE_FETCH_TIMEOUT',
      FIREARM_LICENSE_FETCH_TIMEOUT: '/k8s/api/FIREARM_LICENSE_FETCH_TIMEOUT',
      DRIVING_LICENSE_FETCH_TIMEOUT: '/k8s/api/DRIVING_LICENSE_FETCH_TIMEOUT',
      PKPASS_API_KEY: '/k8s/api/PKPASS_API_KEY',
      PKPASS_API_URL: '/k8s/api/PKPASS_API_URL',
      PKPASS_SECRET_KEY: '/k8s/api/PKPASS_SECRET_KEY',
      PKPASS_CACHE_KEY: '/k8s/api/PKPASS_CACHE_KEY',
      PKPASS_CACHE_TOKEN_EXPIRY_DELTA:
        '/k8s/api/PKPASS_CACHE_TOKEN_EXPIRY_DELTA',
      PKPASS_AUTH_RETRIES: '/k8s/api/PKPASS_AUTH_RETRIES',
      LICENSE_SERVICE_BARCODE_SECRET_KEY:
        '/k8s/api/LICENSE_SERVICE_BARCODE_SECRET_KEY',
    })
    .xroad(Base, Client, Firearm, Disability, DrivingLicense, Hunting)
    .ingress({
      primary: {
        host: {
          dev: 'license-api-xrd',
          staging: 'license-api-xrd',
          prod: 'license-api-xrd',
        },
        paths: ['/'],
        public: false,
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('nginx-ingress-internal')
