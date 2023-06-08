import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  adsBackend: ServiceBuilder<'air-discount-scheme-backend'>
}): ServiceBuilder<'air-discount-scheme-api'> => {
  return service('air-discount-scheme-api')
    .namespace('air-discount-scheme')
    .serviceAccount()
    .env({
      AUTH_AUDIENCE: {
        dev: ref(
          (ctx) =>
            `${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }loftbru.dev01.devland.is`,
        ),
        staging: 'loftbru.staging01.devland.is',
        prod: 'loftbru.island.is',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      ELASTIC_NODE: {
        dev: 'https://vpc-search-njkekqydiegezhr4vqpkfnw5la.eu-west-1.es.amazonaws.com',
        staging:
          'https://vpc-search-q6hdtjcdlhkffyxvrnmzfwphuq.eu-west-1.es.amazonaws.com',
        prod: 'https://vpc-search-mw4w5c2m2g5edjrtvwbpzhkw24.eu-west-1.es.amazonaws.com',
      },
      BACKEND_URL: ref((h) => `http://${h.svc(services.adsBackend)}`),
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      NO_UPDATE_NOTIFIER: 'true',
    })
    .secrets({
      AUTH_JWT_SECRET: '/k8s/air-discount-scheme/api/AUTH_JWT_SECRET',
      CONTENTFUL_ACCESS_TOKEN:
        '/k8s/air-discount-scheme/api/CONTENTFUL_ACCESS_TOKEN',
      DEVELOPERS: '/k8s/air-discount-scheme/api/DEVELOPERS',
      ADMINS: '/k8s/air-discount-scheme/api/ADMINS',
    })

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
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
