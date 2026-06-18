import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  api: ServiceBuilder<'api'>
}): ServiceBuilder<'application-system-next'> => {
  const web = service('application-system-next')
  web
    .namespace('application-system')
    .serviceAccount('application-system-next')
    .env({
      INTERNAL_API_URL: ref((h) => `http://${h.svc(services.api)}`),
      BFF_PROXY_TARGET: ref((h) => `http://${h.svc(services.api)}`),
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
        paths: ['/umsoknir/sdf'],
      },
    })
    .liveness({
      path: '/liveness',
      initialDelaySeconds: 10,
      timeoutSeconds: 5,
    })
    .readiness({ path: '/readiness', initialDelaySeconds: 20 })
    .resources({
      limits: { cpu: '1000m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
    .replicaCount({
      default: 2,
      max: 10,
      min: 2,
      cpuAverageUtilization: 70,
    })
    .grantNamespaces('application-system')
  return web
}
