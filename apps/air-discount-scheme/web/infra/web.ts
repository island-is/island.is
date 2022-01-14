import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  adsApi: ServiceBuilder<'air-discount-scheme-api'>
}): ServiceBuilder<'air-discount-scheme-web'> => {
  return service('air-discount-scheme-web')
    .namespace('air-discount-scheme')
    .env({
      API_URL: ref((h) => `http://${h.svc(services.adsApi)}`),
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? {
        dev: 'https://loftbru.dev01.devland.is',
        staging: 'https://loftbru.staging01.devland.is',
        prod: 'https://loftbru.island.is',
      },
      IDENTITY_SERVER_DOMAIN: 'https://identity-server.dev01.devland.is',
      IDENTITY_SERVER_SECRET:
        '/k8s/air-discount-scheme/web/IDENTITY_SERVER_SECRET',
      IDS_COOKIE_NAME: 'next-auth.session-token',
      SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      LOFTBRU_HOST: {
        dev: 'https://loftbru.dev01.devland.is',
        staging: 'https://loftbru.staging01.devland.is',
        prod: 'https://loftbru.island.is',
      },
    })
    .secrets({
      SENTRY_DSN: '/k8s/air-discount-scheme-api/SENTRY_DSN',
    })

    .ingress({
      primary: {
        host: {
          dev: ['loftbru', 'loftbru-cf'],
          staging: ['loftbru', 'loftbru-cf'],
          prod: ['loftbru'],
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/configuration-snippet':
              'rewrite /$ https://beta.dev01.devland.is/loftbru; rewrite /en$ https://beta.dev01.devland.is/en/lower-airfares-for-residents-in-rural-areas;',
          },
          staging: {
            'nginx.ingress.kubernetes.io/configuration-snippet':
              'rewrite /$ https://beta.staging01.devland.is/loftbru; rewrite /en$ https://beta.staging01.devland.is/en/lower-airfares-for-residents-in-rural-areas;',
          },
          prod: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/configuration-snippet':
              'rewrite /$ https://island.is/loftbru; rewrite /en$ https://island.is/en/lower-airfares-for-residents-in-rural-areas;',
          },
        },
        paths: ['/'],
        public: true,
      },
    })
    .readiness('/readiness')
    .liveness('/liveness')
}
