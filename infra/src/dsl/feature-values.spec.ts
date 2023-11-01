import { ServiceBuilder, ref, service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { EnvironmentConfig } from './types/charts'
import { getFeatureAffectedServices } from './feature-deployments'
import { HelmValueFile } from './types/output-types'
import { getHelmValueFile } from './value-files-generators/helm-value-file'
import { renderers } from './upstream-dependencies'
import { generateOutput } from './processing/rendering-pipeline'

const getEnvironment = (
  options: EnvironmentConfig = {
    auroraHost: 'a',
    redisHost: 'b',
    domain: 'staging01.devland.is',
    type: 'dev',
    featuresOn: [],
    defaultMaxReplicas: 3,
    defaultMinReplicas: 2,
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

    const apiService = service('graphql')
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
      .postgres()

    dev = getEnvironment()
    const services1 = await getFeatureAffectedServices(
      [apiService, dependencyA, dependencyB],
      [dependencyA, dependencyC],
      [dependencyC],
      dev,
    )
    values = await getValues(services1.included, dev)
  })

  it('dynamic service name generation', () => {
    expect(values.services.graphql.env).toEqual({
      A: 'web-service-a',
      B: 'feature-web-service-b.islandis.svc.cluster.local',
      DB_USER: 'feature_feature_A_graphql',
      DB_NAME: 'feature_feature_A_graphql',
      DB_HOST: 'a',
      DB_REPLICAS_HOST: 'a',
      NODE_OPTIONS: '--max-old-space-size=230',
      SERVERSIDE_FEATURES_ON: '',
      DB_EXTENSIONS: 'foo',
    })
  })
  it('db extensions are set', () => {
    expect(values.services.graphql.initContainer?.env).toEqual(
      expect.objectContaining({
        DB_EXTENSIONS: 'foo',
      }),
    )
  })

  it('dynamic secrets path', () => {
    expect(values.services.graphql.secrets).toHaveProperty('DB_PASS')
    expect(values.services.graphql.secrets!.DB_PASS).toEqual(
      '/k8s/feature-feature-A-graphql/DB_PASSWORD',
    )
  })

  it('dynamic secrets path', () => {
    expect(values.services.graphql.initContainer?.secrets).toHaveProperty(
      'DB_PASS',
    )
    expect(values.services.graphql.initContainer?.secrets!.DB_PASS).toEqual(
      '/k8s/feature-feature-A-graphql/DB_PASSWORD',
    )
  })

  it('feature deployment namespaces', () => {
    expect(Object.keys(values.services).sort()).toEqual([
      'graphql',
      'service-a',
    ])
    expect(values.services['graphql'].namespace).toEqual(
      `feature-${dev.feature}`,
    )
    expect(values.services['service-a'].namespace).toEqual(
      `feature-${dev.feature}`,
    )
  })

  it('feature deployment ingress', () => {
    expect(values.services.graphql.ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
        },
        hosts: [
          {
            host: 'feature-A-a.staging01.devland.is',
            paths: ['/'],
          },
        ],
      },
    })
  })
})
