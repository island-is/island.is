import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'
import { createPortalEnv } from '../../../apps/services/bff/infra/utils/createPortalEnv'
import { json } from './dsl'

import { adminPortalScopes } from '../../../libs/auth/scopes/src/index'

import { FIVE_SECONDS_IN_MS } from '../../../apps/services/bff/src/app/constants/time'
const ONE_HOUR_IN_MS = 60 * 60 * 1000
const ONE_WEEK_IN_MS = ONE_HOUR_IN_MS * 24 * 7

const bffName = 'services-bff'
const bffType = 'stjornbord'
const clientName = 'portals-admin'
const serviceName = `${bffName}-${clientName}`

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('BFF PortalEnv serialization', () => {
  const sut = service(serviceName)
    .namespace(clientName)
    .image(bffName)
    .redis()
    .serviceAccount(bffName)
    .env(createPortalEnv(bffType))
    .secrets({
      BFF_TOKEN_SECRET_BASE64: `/k8s/${bffName}/${clientName}/BFF_TOKEN_SECRET_BASE64`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${bffName}/${clientName}/IDENTITY_SERVER_CLIENT_SECRET`,
    })
    .command('node')
    .args('main.js')
    .readiness('/health/check')
    .liveness('/liveness')
    .replicaCount({
      default: 2,
      min: 2,
      max: 3,
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
        paths: [`/${bffType}/bff`],
      },
    })
  let result: SerializeSuccess<HelmService>
  beforeEach(async () => {
    result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
  })

  it('basic props', () => {
    expect(result.serviceDef[0].enabled).toBe(true)
    expect(result.serviceDef[0].namespace).toBe(clientName)
  })

  it('image and repo', () => {
    expect(result.serviceDef[0].image.repository).toBe(
      `821090935708.dkr.ecr.eu-west-1.amazonaws.com/${bffName}`,
    )
  })

  it('command and args', () => {
    expect(result.serviceDef[0].command).toStrictEqual(['node'])
    expect(result.serviceDef[0].args).toStrictEqual(['main.js'])
  })
  it('network policies', () => {
    expect(result.serviceDef[0].grantNamespaces).toStrictEqual([])
    expect(result.serviceDef[0].grantNamespacesEnabled).toBe(false)
  })

  it('resources', () => {
    expect(result.serviceDef[0].resources).toStrictEqual({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
    })
  })
  it('replica count', () => {
    expect(result.serviceDef[0].replicaCount).toStrictEqual({
      min: 2,
      max: 3,
      default: 2,
    })
  })

  it('environment variables', () => {
    expect(result.serviceDef[0].env).toEqual({
      IDENTITY_SERVER_CLIENT_SCOPES: json(adminPortalScopes),
      IDENTITY_SERVER_CLIENT_ID: `@admin.island.is/bff-${bffType}`,
      IDENTITY_SERVER_ISSUER_URL: 'https://identity-server.dev01.devland.is',
      // BFF
      BFF_NAME: 'stjornbord',
      BFF_CLIENT_KEY_PATH: `/${bffType}`,
      BFF_PAR_SUPPORT_ENABLED: 'false',
      BFF_ALLOWED_REDIRECT_URIS: json([
        'https://featbff-beta.dev01.devland.is',
      ]),
      BFF_CLIENT_BASE_URL: 'https://featbff-beta.dev01.devland.is',
      BFF_LOGOUT_REDIRECT_URI: 'https://featbff-beta.dev01.devland.is',
      BFF_CALLBACKS_BASE_PATH: `https://featbff-beta.dev01.devland.is/${bffType}/bff/callbacks`,
      BFF_PROXY_API_ENDPOINT:
        'https://featbff-beta.dev01.devland.is/api/graphql',
      BFF_ALLOWED_EXTERNAL_API_URLS: json(['https://api.dev01.devland.is']),
      BFF_CACHE_USER_PROFILE_TTL_MS: (
        ONE_HOUR_IN_MS - FIVE_SECONDS_IN_MS
      ).toString(),
      BFF_LOGIN_ATTEMPT_TTL_MS: ONE_WEEK_IN_MS.toString(),
      NODE_OPTIONS: '--max-old-space-size=460 -r dd-trace/init',
      SERVERSIDE_FEATURES_ON: '',
      LOG_LEVEL: 'info',
      REDIS_URL_NODE_01: 'b',
    })
  })

  it('secrets', () => {
    expect(result.serviceDef[0].secrets).toEqual({
      BFF_TOKEN_SECRET_BASE64: `/k8s/${bffName}/${clientName}/BFF_TOKEN_SECRET_BASE64`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${bffName}/${clientName}/IDENTITY_SERVER_CLIENT_SECRET`,
      CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
    })
  })

  it('service account', () => {
    expect(result.serviceDef[0].podSecurityContext).toEqual({
      fsGroup: 65534,
    })
    expect(result.serviceDef[0].serviceAccount).toEqual({
      annotations: {
        'eks.amazonaws.com/role-arn': `arn:aws:iam::111111:role/${bffName}`,
      },
      create: true,
      name: bffName,
    })
  })

  it('ingress', () => {
    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
          'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
        },
        hosts: [
          {
            host: 'beta.dev01.devland.is',
            paths: ['/stjornbord/bff'],
          },
        ],
      },
    })
  })
})

describe('Env definition defaults', () => {
  const sut = service('api').namespace('islandis').image(bffName)
  let result: SerializeSuccess<HelmService>
  beforeEach(async () => {
    result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
  })
  it('replica max count', () => {
    expect(result.serviceDef[0].replicaCount).toStrictEqual({
      min: 2,
      max: 3,
      default: 2,
    })
  })
})
