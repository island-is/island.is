import { ref, service, ServiceBuilder } from '../../../../libs/helm/dsl/dsl'
import { MissingSetting } from '../../../../libs/helm/dsl/types/input-types'

export const serviceSetup = (services: {}): ServiceBuilder<'application-system-form'> =>
  service('application-system-form')
    .namespace('application-system')
    .liveness('/liveness')
    .readiness('/readiness')
    .env({
      BASEPATH: '/umsoknir',
      SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        extraAnnotations: {
          dev: {},
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
        paths: ['/umsoknir'],
      },
    })
