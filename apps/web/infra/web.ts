import { ref, service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'api'>
}): ServiceBuilder<'web'> => {
  const web = service('web')
  web
    .namespace('islandis')
    .env({
      API_URL: ref((h) => `http://${h.svc(services.api)}`),
      TRACKING_DOMAIN: {
        dev: 'beta.dev01.devland.is',
        staging: 'beta.staging01.devland.is',
        prod: 'island.is',
      },
      DISABLE_API_CATALOGUE: { dev: 'false', staging: 'false', prod: 'false' },
      DISABLE_SYSLUMENN_PAGE: { dev: 'false', staging: 'false', prod: 'false' },
      DISABLE_ORGANIZATION_CHATBOT: {
        dev: 'false',
        staging: 'false',
        prod: 'false',
      },
      ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
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
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
        paths: ['/'],
      },
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
    .replicaCount({
      default: 10,
      max: 50,
      min: 10,
    })
    .extraAttributes({
      dev: {},
      staging: { basicAuth: '/k8s/web/basic_auth' },
      prod: {},
    })
  return web
}
