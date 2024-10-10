import { ServiceBuilder, service } from '../../../../infra/src/dsl/dsl'
import { createPortalEnv } from './utils/createPortalEnv'
const bffName = 'services-bff'
const clientName = 'portals-admin'
const serviceName = `${bffName}-${clientName}`

export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .namespace(clientName)
    .image(bffName)
    .redis()
    .serviceAccount(bffName)
    .env(createPortalEnv('stjornbord'))
    .secrets({
      // The secret should be a valid 32-byte base64 key.
      // Generate key example: `openssl rand -base64 32`
      BFF_TOKEN_SECRET_BASE64: `/k8s/${bffName}/${clientName}/BFF_TOKEN_SECRET_BASE64`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${bffName}/${clientName}/IDENTITY_SERVER_CLIENT_SECRET`,
    })
    .readiness('/health/check')
    .liveness('/liveness')
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
        paths: ['/stjornbord/bff'],
      },
    })
