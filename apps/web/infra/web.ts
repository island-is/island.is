import {
  CodeOwners,
  ref,
  service,
  ServiceBuilder,
} from '../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'api'>
}): ServiceBuilder<'web'> => {
  const web = service('web')
  web
    .namespace('islandis')
    .serviceAccount('web')
    .codeOwner(CodeOwners.Stefna)
    .env({
      API_URL: ref((h) => `http://${h.svc(services.api)}`),
      TRACKING_DOMAIN: {
        dev: 'beta.dev01.devland.is',
        staging: 'beta.staging01.devland.is',
        prod: 'island.is',
      },
      NEXT_PUBLIC_MATOMO_DOMAIN: {
        // test
        dev: 'https://matomo-dev.dev01.devland.is',
        staging: 'https://matomo-dev.dev01.devland.is',
        prod: 'https://matomo-dev.dev01.devland.is',
      },
      NEXT_PUBLIC_MATOMO_SITE_ID: { dev: '2', staging: '2', prod: '2' },
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
      DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
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
          },
        },
        paths: ['/'],
      },
    })
    .liveness({
      path: '/liveness',
      initialDelaySeconds: 10,
      timeoutSeconds: 5,
    })
    .readiness({ path: '/readiness', initialDelaySeconds: 20 })
    .resources({
      limits: { cpu: '1800m', memory: '1500Mi' },
      requests: { cpu: '1200m', memory: '1024Mi' },
    })
    .replicaCount({
      default: 3,
      max: 50,
      min: 3,
      cpuAverageUtilization: 70,
    })
    .extraAttributes({
      dev: {},
      staging: { basicAuth: '/k8s/web/basic_auth' },
      prod: {},
    })
    .grantNamespaces(
      'nginx-ingress-external',
      'api-catalogue',
      'application-system',
      'consultation-portal',
      'search-indexer',
    )
  return web
}
