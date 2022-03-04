import { generateYamlForFeature } from './serialize-to-yaml'
import { ref, service, ServiceBuilder } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  feature: 'feature-A',
  global: {},
}

describe('Feature-deployment support', () => {
  const dependencyA = service('service-a').namespace('A')
  const dependencyB = service('service-b')
  const apiService: ServiceBuilder<'graphql'> = service('graphql')
    .env({
      A: ref((h) => `${h.svc(dependencyA)}`),
      B: ref((h) => `${h.featureName ? 'feature-' : ''}${h.svc(dependencyB)}`),
    })
    .initContainer({
      containers: [
        {
          command: 'node',
        },
      ],
      postgres: {},
    })
    .ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/'],
      },
    })
    .postgres()

  const chart = new UberChart(Dev)
  const values = generateYamlForFeature(
    chart,
    [apiService, dependencyA, dependencyB],
    dependencyA,
  )

  it('dynamic service name generation', () => {
    expect(values.services.graphql.env).toEqual({
      A: 'web-service-a',
      B: 'feature-web-service-b.islandis.svc.cluster.local',
      DB_USER: 'feature_feature_A_graphql',
      DB_NAME: 'feature_feature_A_graphql',
      DB_HOST: 'a',
      SERVERSIDE_FEATURES_ON: '',
    })
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
      `feature-${Dev.feature}`,
    )
    expect(values.services['service-a'].namespace).toEqual(
      `feature-${Dev.feature}`,
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
