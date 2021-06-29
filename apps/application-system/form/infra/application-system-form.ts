import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

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
    .secrets({
      PARTY_APPLICATION_RVK_SOUTH_ASSIGNED_ADMINS:
        '/k8s/application-system-form/PARTY_APPLICATION_RVK_SOUTH_ASSIGNED_ADMINS',
      PARTY_APPLICATION_RVK_NORTH_ASSIGNED_ADMINS:
        '/k8s/application-system-form/PARTY_APPLICATION_RVK_NORTH_ASSIGNED_ADMINS',
      PARTY_APPLICATION_SOUTH_WEST_ASSIGNED_ADMINS:
        '/k8s/application-system-form/PARTY_APPLICATION_SOUTH_WEST_ASSIGNED_ADMINS',
      PARTY_APPLICATION_NORTH_WEST_ASSIGNED_ADMINS:
        '/k8s/application-system-form/PARTY_APPLICATION_NORTH_WEST_ASSIGNED_ADMINS',
      PARTY_APPLICATION_NORTH_ASSIGNED_ADMINS:
        '/k8s/application-system-form/PARTY_APPLICATION_NORTH_ASSIGNED_ADMINS',
      PARTY_APPLICATION_SOUTH_ASSIGNED_ADMINS:
        '/k8s/application-system-form/PARTY_APPLICATION_SOUTH_ASSIGNED_ADMINS',
      PARTY_LETTER_ASSIGNED_ADMINS:
        '/k8s/application-system-form/PARTY_LETTER_ASSIGNED_ADMINS',
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
