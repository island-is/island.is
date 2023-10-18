import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'judicial-system-api'>
}): ServiceBuilder<'judicial-system-web'> =>
  service('judicial-system-web')
    .namespace('judicial-system')
    .env({
      API_URL: {
        dev: ref((h) => `https://judicial-system.${h.env.domain}`),
        staging: ref((h) => `https://judicial-system.${h.env.domain}`),
        prod: 'https://rettarvorslugatt.island.is',
      },
      INTERNAL_API_URL: ref((h) => `http://${h.svc(services.api)}`),
    })
    .secrets({
      NATIONAL_REGISTRY_API_KEY:
        '/k8s/judicial-system/NATIONAL_REGISTRY_API_KEY',
      LAWYERS_ICELAND_API_KEY: '/k8s/judicial-system/LAWYERS_ICELAND_API_KEY',
      SUPPORT_EMAIL: '/k8s/judicial-system/SUPPORT_EMAIL',
    })
    .liveness('/liveness')
    .readiness({ path: '/liveness', initialDelaySeconds: 10 })
    .resources({
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
      requests: {
        cpu: '15m',
        memory: '128Mi',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'judicial-system',
          staging: 'judicial-system',
          prod: 'rettarvorslugatt.island.is',
        },
        paths: ['/'],
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
