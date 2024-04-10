import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'skilavottord-ws'>
}): ServiceBuilder<'skilavottord-web'> =>
  service('skilavottord-web')
    .namespace('skilavottord')
    .liveness('/liveness')
    .readiness('/liveness')
    .resources({
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
      requests: {
        cpu: '20m',
        memory: '128Mi',
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
      DD_RUM_APPLICATION_ID: '/k8s/DD_RUM_APPLICATION_ID',
      DD_RUM_CLIENT_TOKEN: '/k8s/DD_RUM_CLIENT_TOKEN',
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
