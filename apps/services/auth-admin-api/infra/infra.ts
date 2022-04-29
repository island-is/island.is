import { identity } from 'lodash'
import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  NationalRegistry,
  Client,
} from '../../../../infra/src/dsl/xroad'
export const serviceSetup = (): ServiceBuilder<'auth-audmin-api'> => {
  return service('auth-admin-api')
    .namespace('identity-server-admin')
    .env({
      // BACKEND_URL: ref((h) => `http://${h.svc(services.adsBackend)}`),
      IDENTITYSERVER_ID: 'identity-server',
      IDENTITYSERVER_DOMAIN: {
        dev: 'identity-server.dev01.devland.is',
        staging: 'identity-server.staging01.devland.is',
        prod: 'innskra.island.is'
      }
    })
    .secrets({
      IDENTITYSERVER_SECRET: '/k8s/auth-admin-web/IDENTITYSERVER_SECRET',
    })
    .xroad(NationalRegistry)

    .ingress({
      primary: {
        host: {
          dev: ['loftbru', 'loftbru-cf'],
          staging: ['loftbru', 'loftbru-cf'],
          prod: ['loftbru'],
        },
        extraAnnotations: {
          dev: {},
          staging: {},
          prod: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
        paths: ['/api/graphql'],
        public: true,
      },
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
