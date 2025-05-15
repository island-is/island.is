import { getScopes } from './bff'
import { ServiceBuilder, json, ref, service } from './dsl'
import { getFeatureAffectedServices } from './feature-deployments'
import { Kubernetes } from './kubernetes-runtime'
import { generateOutput } from './processing/rendering-pipeline'
import { EnvironmentConfig } from './types/charts'
import { HelmValueFile } from './types/output-types'
import { renderers } from './upstream-dependencies'
import { getHelmValueFile } from './value-files-generators/helm-value-file'

const getEnvironment = (
  options: EnvironmentConfig = {
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
    feature: 'feature-A',
    global: {},
  },
) => {
  return { ...options }
}

const getValues = async (
  services: ServiceBuilder<any>[],
  env: EnvironmentConfig,
) => {
  const chart = new Kubernetes(env)
  const out = await generateOutput({
    runtime: chart,
    services: services,
    outputFormat: renderers.helm,
    env: env,
  })
  const values = getHelmValueFile(chart, out, 'no-mocks', env)
  return values
}

describe('Feature-deployment support', () => {
  let values: HelmValueFile
  let dev: EnvironmentConfig

  beforeEach(async () => {
    const dependencyA = service('service-a').namespace('A')
    const dependencyB = service('service-b')
    const dependencyC = service('service-c')
    const apiService = service('api')
      .env({
        A: ref((h) => `${h.svc(dependencyA)}`),
        B: ref(
          (h) =>
            `${h.featureDeploymentName ? 'feature-' : ''}${h.svc(dependencyB)}`,
        ),
      })
      .initContainer({
        containers: [
          {
            command: 'node',
          },
        ],
        postgres: {
          extensions: ['foo'],
        },
      })
      .ingress({
        primary: {
          host: { dev: 'a', staging: 'a', prod: 'a' },
          paths: ['/'],
        },
      })
      .db()

    const bff = service('services-bff-portals-admin')
      .bff({
        key: 'stjornbord',
        clientId: '@admin.island.is/bff-stjornbord',
        clientName: 'portals-admin',
        services: { api: apiService },
        globalPrefix: '/stjornbord/bff',
      })
      .env({
        BFF_ALLOWED_EXTERNAL_API_URLS: {
          local: json(['http://localhost:3377/download/v1']),
          dev: json(['https://api.dev01.devland.is']),
          staging: json(['https://api.staging01.devland.is']),
          prod: json(['https://api.island.is']),
        },
      })
      .redis()
    dev = getEnvironment()
    const services1 = await getFeatureAffectedServices(
      [apiService, dependencyA, dependencyB, bff],
      [dependencyA, dependencyC, bff],
      [dependencyC],
      dev,
    )
    values = await getValues(services1.included, dev)
  })

  it('dynamic service name generation', () => {
    expect(values.services.api.env).toEqual({
      A: 'web-service-a',
      B: 'feature-web-service-b',
      DB_USER: 'feature_feature_A_api',
      DB_NAME: 'feature_feature_A_api',
      DB_HOST: 'a',
      DB_REPLICAS_HOST: 'a',
      NODE_OPTIONS:
        '--max-old-space-size=230 --enable-source-maps -r dd-trace/init',
      SERVERSIDE_FEATURES_ON: '',
      LOG_LEVEL: 'info',
      DB_EXTENSIONS: 'foo',
    })
  })
  it('bff feature env urls', () => {
    expect(values.services['services-bff-portals-admin'].env).toEqual({
      IDENTITY_SERVER_CLIENT_SCOPES: json(getScopes('stjornbord')),
      IDENTITY_SERVER_CLIENT_ID: `@admin.island.is/bff-stjornbord`,
      IDENTITY_SERVER_ISSUER_URL: 'https://identity-server.dev01.devland.is',
      BFF_NAME: 'stjornbord',
      BFF_CLIENT_BASE_PATH: '/stjornbord',
      BFF_GLOBAL_PREFIX: `/stjornbord/bff`,
      BFF_PAR_SUPPORT_ENABLED: 'false',
      BFF_ALLOWED_REDIRECT_URIS: json([
        'https://feature-A-beta.dev01.devland.is/stjornbord',
      ]),
      BFF_CLIENT_BASE_URL: 'https://feature-A-beta.dev01.devland.is',
      BFF_LOGOUT_REDIRECT_URI: 'https://feature-A-beta.dev01.devland.is',
      BFF_CALLBACKS_BASE_PATH: `https://feature-A-beta.dev01.devland.is/stjornbord/bff/callbacks`,
      BFF_PROXY_API_ENDPOINT: 'http://web-api/api/graphql',
      BFF_ALLOWED_EXTERNAL_API_URLS: json(['https://api.dev01.devland.is']),
      BFF_CACHE_USER_PROFILE_TTL_MS: '3595000',
      BFF_LOGIN_ATTEMPT_TTL_MS: '604800000',
      NODE_OPTIONS:
        '--max-old-space-size=230 --enable-source-maps -r dd-trace/init',
      SERVERSIDE_FEATURES_ON: '',
      LOG_LEVEL: 'info',
      REDIS_URL_NODE_01: 'b',
    })
  })
  it('db extensions are set', () => {
    expect(values.services.api.initContainer?.env).toEqual(
      expect.objectContaining({
        DB_EXTENSIONS: 'foo',
      }),
    )
  })

  it('dynamic secrets path', () => {
    expect(values.services.api.secrets).toHaveProperty('DB_PASS')
    expect(values.services.api.secrets!.DB_PASS).toEqual(
      '/k8s/feature-feature-A-api/DB_PASSWORD',
    )
  })

  it('dynamic secrets path', () => {
    expect(values.services.api.initContainer?.secrets).toHaveProperty('DB_PASS')
    expect(values.services.api.initContainer?.secrets!.DB_PASS).toEqual(
      '/k8s/feature-feature-A-api/DB_PASSWORD',
    )
  })

  it('feature deployment namespaces', () => {
    expect(Object.keys(values.services).sort()).toEqual([
      'api',
      'service-a',
      'services-bff-portals-admin',
    ])
    expect(values.services['api'].namespace).toEqual(`feature-${dev.feature}`)
    expect(values.services['services-bff-portals-admin'].namespace).toEqual(
      `feature-${dev.feature}`,
    )
    expect(values.services['service-a'].namespace).toEqual(
      `feature-${dev.feature}`,
    )
  })

  it('feature deployment ingress', () => {
    expect(values.services.api.ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
        },
        hosts: [
          {
            host: 'feature-A-a.dev01.devland.is',
            paths: ['/'],
          },
        ],
      },
    })
  })
})
