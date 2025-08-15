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
    .codeOwner(CodeOwners.Stefna)
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
      PAYMENTS_WEB_URL: {
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }beta.dev01.devland.is/greida`,
        ),
        staging: `https://beta.staging01.devland.is/greida`,
        prod: `https://island.is/greida`,
      },
      LANDSPITALI_PAYMENT_FLOW_EVENT_CALLBACK_URL: ref(
        (ctx) =>
          `http://${
            ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
          }web.islandis.svc.cluster.local/payments/event-callback`,
      ),
    })
    .secrets({
      DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
      LANDSPITALI_MINNINGARKORT_OG_STYRKIR_ZENDESK_EMAIL:
        '/k8s/api/LANDSPITALI_MINNINGARKORT_OG_STYRKIR_ZENDESK_EMAIL',
      WEB_PAYMENT_CONFIRMATION_SECRET:
        '/k8s/api/WEB_PAYMENT_CONFIRMATION_SECRET',
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
    .liveness('/liveness')
    .readiness({ path: '/readiness', initialDelaySeconds: 20 })
    .resources({
      limits: { cpu: '1000m', memory: '768Mi' },
      requests: { cpu: '300m', memory: '384Mi' },
    })
    .replicaCount({
      default: 2,
      max: 50,
      min: 2,
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
      'payments',
    )
  return web
}
