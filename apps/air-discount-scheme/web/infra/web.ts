import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const extraAnnotations = {
  'nginx.ingress.kubernetes.io/proxy-buffer-size': '16k',
  'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
  'nginx.ingress.kubernetes.io/proxy-buffers-number': '4',
  'nginx.ingress.kubernetes.io/server-snippet':
    'client_header_buffer_size 16k; large_client_header_buffers 4 16k;',
}

export const serviceSetup = (services: {
  adsApi: ServiceBuilder<'air-discount-scheme-api'>
}): ServiceBuilder<'air-discount-scheme-web'> => {
  return service('air-discount-scheme-web')
    .namespace('air-discount-scheme')
    .env({
      API_URL: ref((h) => `http://${h.svc(services.adsApi)}`),
      IDENTITY_SERVER_ISSUER_DOMAIN: {
        dev: 'identity-server.dev01.devland.is',
        staging: 'identity-server.staging01.devland.is',
        prod: 'innskra.island.is',
      },
      NEXTAUTH_URL: {
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }loftbru.dev01.devland.is`,
        ),
        staging: 'https://loftbru.staging01.devland.is',
        prod: 'https://loftbru.island.is',
      },
      ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
      DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
      IDENTITY_SERVER_SECRET:
        '/k8s/air-discount-scheme/web/IDENTITY_SERVER_SECRET',
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
            ...extraAnnotations,
            'nginx.ingress.kubernetes.io/configuration-snippet':
              'rewrite /$ https://beta.dev01.devland.is/loftbru; rewrite /en$ https://beta.dev01.devland.is/en/lower-airfares-for-residents-in-rural-areas;',
          },
          staging: {
            ...extraAnnotations,
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
        paths: ['/'],
        public: true,
      },
    })
    .replicaCount({
      min: 2,
      max: 10,
      default: 2,
      scalingMagicNumber: 20,
    })
    .readiness('/readiness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-external', 'islandis')
}
