/* eslint-disable @nx/enforce-module-boundaries */
import { ServiceBuilder, service, json } from '../../../../infra/src/dsl/dsl'
import { BffInfraServices } from '../../../../infra/src/dsl/types/input-types'
import {
  adminPortalScopes,
  servicePortalScopes,
} from '../../../../libs/auth/scopes/src/index'

const bffName = 'services-bff'
const clientName = 'portals-admin'
const serviceName = `${bffName}-${clientName}`
const key = 'stjornbord'

type PortalKeys = 'stjornbord' | 'minarsidur'

const getScopes = (key: PortalKeys) => {
  switch (key) {
    case 'minarsidur':
      return servicePortalScopes
    case 'stjornbord':
      return adminPortalScopes
    default:
      throw new Error('Invalid BFF client')
  }
}
export const serviceSetup = (
  services: BffInfraServices,
): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .namespace(clientName)
    .image(bffName)
    .redis()
    .serviceAccount(bffName)
    .bff({
      key: 'stjornbord',
      clientName,
      services,
      env: {
        IDENTITY_SERVER_CLIENT_SCOPES: json(getScopes(key)),
      },
    })
    .readiness(`/${key}/bff/health/check`)
    .liveness(`/${key}/bff/liveness`)
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
