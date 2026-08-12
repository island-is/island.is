import {
  staticService,
  StaticServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import type {
  ContentSecurityPolicy,
  EnvironmentContentSecurityPolicies,
} from '../../../../infra/src/dsl/dsl'

const storybookPolicy: ContentSecurityPolicy = {
  defaultSrc: ["'self'"],
  baseUri: ["'self'"],
  objectSrc: ["'none'"],
  manifestSrc: ["'self'"],
  // Storybook's channel serializer revives values with `new Function`.
  scriptSrc: ["'self'", "'unsafe-eval'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
  imgSrc: [
    "'self'",
    'data:',
    'blob:',
    'https://images.ctfassets.net',
    'https://www.stevensegallery.com',
  ],
  mediaSrc: ["'self'", 'data:', 'blob:'],
  workerSrc: ["'self'", 'blob:'],
  frameSrc: [
    "'self'",
    'https://www.youtube.com',
    'https://www.youtube-nocookie.com',
    'https://player.vimeo.com',
  ],
  frameAncestors: ["'self'"],
  formAction: ["'self'"],
}

const storybookPolicies: EnvironmentContentSecurityPolicies = {
  local: {
    ...storybookPolicy,
    connectSrc: [
      "'self'",
      'http://localhost:5000',
      'https://fonts.googleapis.com',
    ],
  },
  dev: {
    ...storybookPolicy,
    connectSrc: ["'self'", 'https://fonts.googleapis.com'],
  },
  staging: {
    ...storybookPolicy,
    connectSrc: ["'self'", 'https://fonts.googleapis.com'],
  },
  prod: {
    ...storybookPolicy,
    connectSrc: ["'self'", 'https://fonts.googleapis.com'],
  },
}

export const serviceSetup = (
  _services: object,
): StaticServiceBuilder<'island-ui-storybook'> =>
  staticService('island-ui-storybook')
    .csp({ enforce: storybookPolicies, hashDirectives: ['script-src'] })
    .namespace('storybook')
    .liveness('/liveness')
    .readiness('/readiness')
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
          dev: 'ui',
          staging: 'ui',
          prod: 'ui.devland.is',
        },
        paths: ['/'],
      },
    })
    .grantNamespaces('nginx-ingress-external')
