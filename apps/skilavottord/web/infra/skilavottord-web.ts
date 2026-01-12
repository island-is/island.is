import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'skilavottord-ws'>
}): ServiceBuilder<'skilavottord-web'> =>
  service('skilavottord-web')
    .namespace('skilavottord')
    .serviceAccount('skilavottord-web')
    .liveness('/liveness')
    .readiness('/liveness')
    .replicaCount({
      default: 2,
      max: 10,
      min: 2,
      scalingMagicNumber: 8,
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '40m',
        memory: '256Mi',
      },
    })
    .env({
      API_URL: ref((h) => `http://${h.svc(services.api)}`),
      ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
      IDENTITY_SERVER_DOMAIN: '/k8s/skilavottord/web/IDENTITY_SERVER_DOMAIN',
      SKILAVOTTORD_WEB_IDS_CLIENT_SECRET:
        '/k8s/skilavottord/web/IDENTITY_SERVER_CLIENT_SECRET',
      IDENTITY_SERVER_LOGOUT_REDIRECT_URL:
        '/k8s/skilavottord/web/IDENTITY_SERVER_LOGOUT_REDIRECT_URL',
      NEXTAUTH_URL: '/k8s/skilavottord/web/NEXTAUTH_URL',
      DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/app/skilavottord/'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
      },
    })
    .grantNamespaces('nginx-ingress-external')
