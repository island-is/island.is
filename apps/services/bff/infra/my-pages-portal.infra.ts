import { ServiceBuilder, json, service } from '../../../../infra/src/dsl/dsl'
import { BffInfraServices } from '../../../../infra/src/dsl/types/input-types'

const bffName = 'services-bff'
const clientName = 'portals-my-pages'
const serviceName = `${bffName}-${clientName}`
const key = 'minarsidur'

export const serviceSetup = (
  services: BffInfraServices,
): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .namespace(clientName)
    .image(bffName)
    .redis()
    .serviceAccount(bffName)
    .env({
      BFF_ALLOWED_EXTERNAL_API_URLS: {
        local: json(['http://localhost:3377/download/v1']),
        dev: json(['https://api.dev01.devland.is']),
        staging: json(['https://api.staging01.devland.is']),
        prod: json(['https://api.island.is']),
      },
    })
    .bff({
      key,
      clientId: '@island.is/web',
      clientName,
      services,
      globalPrefix: '/bff',
      allowedRedirectUris: {
        local: ['http://localhost:4242/umsoknir'],
      },
    })
    .readiness('/bff/health/check')
    .liveness('/bff/liveness')
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
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
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
        paths: ['/bff'],
      },
    })
    .grantNamespaces('identity-server')
