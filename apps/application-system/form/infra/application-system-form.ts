import {
  ref,
  staticService,
  StaticServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import { applicationContentSecurityPolicies } from '../../../../infra/src/dsl/application-content-security-policy'

const serviceName = 'application-system-form'

export const serviceSetup = (): StaticServiceBuilder<typeof serviceName> =>
  staticService(serviceName)
    .csp({
      enforce: applicationContentSecurityPolicies({
        local: {
          styleSrc: ['https://cdnjs.cloudflare.com'],
          styleSrcElem: ['https://cdnjs.cloudflare.com'],
          imgSrc: [
            'https://s3.eu-west-1.amazonaws.com',
            'https://*.s3.eu-west-1.amazonaws.com',
          ],
        },
        dev: {
          styleSrc: ['https://cdnjs.cloudflare.com'],
          styleSrcElem: ['https://cdnjs.cloudflare.com'],
          imgSrc: [
            'https://s3.eu-west-1.amazonaws.com',
            'https://*.s3.eu-west-1.amazonaws.com',
            'https://adverts.official-journal.dev.dmr-dev.cloud',
          ],
        },
        staging: {
          styleSrc: ['https://cdnjs.cloudflare.com'],
          styleSrcElem: ['https://cdnjs.cloudflare.com'],
          imgSrc: [
            'https://s3.eu-west-1.amazonaws.com',
            'https://*.s3.eu-west-1.amazonaws.com',
          ],
        },
        prod: {
          styleSrc: ['https://cdnjs.cloudflare.com'],
          styleSrcElem: ['https://cdnjs.cloudflare.com'],
          imgSrc: [
            'https://s3.eu-west-1.amazonaws.com',
            'https://*.s3.eu-west-1.amazonaws.com',
            'https://adverts.stjornartidindi.is',
          ],
        },
      }),
      hashDirectives: ['script-src', 'style-src-elem'],
    })
    .namespace('application-system')
    .serviceAccount('application-system-form')
    .liveness('/liveness')
    .readiness('/readiness')
    .env({
      BASEPATH: '/umsoknir',
      SI_PUBLIC_ENVIRONMENT: ref((h) => h.env.type),
    })
    .secrets({
      SI_PUBLIC_DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
    })
    .resources({
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
      requests: {
        cpu: '10m',
        memory: '128Mi',
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
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
        paths: ['/umsoknir'],
      },
    })
    .grantNamespaces(
      'nginx-ingress-internal',
      'nginx-ingress-external',
      'islandis',
    )
