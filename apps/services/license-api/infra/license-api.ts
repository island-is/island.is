import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  Disability,
  Firearm,
} from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'license-api'> =>
  service('license-api')
    .namespace('license-api')
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '15m', memory: '256Mi' },
    })
    .secrets({
      SMART_SOLUTIONS_API_URL: '/k8s/api/SMART_SOLUTIONS_API_URL',
      RLS_PKPASS_API_KEY: '/k8s/api/RLS_PKPASS_API_KEY',
      RLS_OPEN_LOOKUP_API_KEY: '/k8s/api/RLS_OPEN_LOOKUP_API_KEY',
      FIREARM_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/api/FIREARM_LICENSE_PASS_TEMPLATE_ID',
      TR_PKPASS_API_KEY: '/k8s/api/TR_PKPASS_API_KEY',
      DISABILITY_LICENSE_PASS_TEMPLATE_ID:
        '/k8s/DISABILITY_LICENSE_PASS_TEMPLATE_ID',
    })
    .xroad(Base, Client, Firearm, Disability)
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
