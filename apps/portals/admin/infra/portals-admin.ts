import {
  ref,
  staticService,
  StaticServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import { applicationContentSecurityPolicies } from '../../../../infra/src/dsl/application-content-security-policy'

export const serviceSetup = (): StaticServiceBuilder<'portals-admin'> =>
  staticService('portals-admin')
    .csp({
      enforce: applicationContentSecurityPolicies({
        local: {
          connectSrc: [
            'https://files.reglugerd.is',
            'https://identity-server.dev01.devland.is',
          ],
          imgSrc: ['https://files.reglugerd.is'],
        },
        dev: {
          connectSrc: [
            'https://files.reglugerd.is',
            'https://identity-server.dev01.devland.is',
          ],
          imgSrc: ['https://files.reglugerd.is'],
        },
        staging: {
          connectSrc: [
            'https://files.reglugerd.is',
            'https://identity-server.staging01.devland.is',
          ],
          imgSrc: ['https://files.reglugerd.is'],
        },
        prod: {
          connectSrc: [
            'https://files.reglugerd.is',
            'https://innskra.island.is',
          ],
          imgSrc: ['https://files.reglugerd.is'],
        },
      }),
      hashDirectives: ['script-src', 'style-src-elem'],
    })
    .namespace('portals-admin')
    .serviceAccount('portals-admin')
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 2,
      max: 30,
      min: 2,
      scalingMagicNumber: 8,
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '25m', memory: '256Mi' },
    })
    .env({
      BASEPATH: '/stjornbord',
      SI_PUBLIC_ENVIRONMENT: ref((h) => h.env.type),
      SI_PUBLIC_FORM_SYSTEM_URL: {
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }beta.dev01.devland.is/form`,
        ),
        staging: `https://beta.staging01.devland.is/form`,
        prod: `https://island.is/form`,
        local: 'http://localhost:4242/form',
      },
    })
    .secrets({
      SI_PUBLIC_DD_LOGS_CLIENT_TOKEN: '/k8s/DD_LOGS_CLIENT_TOKEN',
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
        paths: ['/stjornbord'],
      },
    })
    .grantNamespaces('nginx-ingress-external', 'identity-server')
