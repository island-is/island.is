import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  Disability,
  Firearm,
  DrivingLicense,
} from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'license-api'> =>
  service('license-api')
    .namespace('license-api')
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '15m', memory: '256Mi' },
    })
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .secrets({
      SMART_SOLUTIONS_API_URL: '/k8s/api/SMART_SOLUTIONS_API_URL',
      RLS_PKPASS_API_KEY: '/k8s/api/RLS_PKPASS_API_KEY',
      RLS_OPEN_LOOKUP_API_KEY: '/k8s/api/RLS_OPEN_LOOKUP_API_KEY',
      DRIVING_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/DRIVING_LICENSE_PASS_TEMPLATE_ID',
      FIREARM_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/FIREARM_LICENSE_PASS_TEMPLATE_ID',
      TR_PKPASS_API_KEY: '/k8s/api/TR_PKPASS_API_KEY',
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
      VE_PKPASS_API_KEY: '/k8s/api/VE_PKPASS_API_KEY',
    })
    .xroad(Base, Client, Firearm, Disability, DrivingLicense)
    .ingress({
      primary: {
        host: {
          dev: 'license-api-xrd',
          staging: 'license-api-xrd',
          prod: 'license-api-xrd',
        },
        paths: ['/'],
        public: false,
        extraAnnotations: {
          dev: {},
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
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
