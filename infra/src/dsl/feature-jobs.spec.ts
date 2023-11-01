import { ServiceBuilder, ref, service } from './dsl'
import { renderHelmJobForFeature } from './exports/helm'
import { Kubernetes } from './kubernetes-runtime'
import { EnvironmentConfig } from './types/charts'
import { getFeatureAffectedServices } from './feature-deployments'
import { FeatureKubeJob, HelmValueFile } from './types/output-types'

const getEnvironment = (
  options: EnvironmentConfig = {
    auroraHost: 'aurora',
    redisHost: 'redis',
    domain: 'staging01.devland.is',
    type: 'dev',
    featuresOn: [],
    defaultMaxReplicas: 3,
    defaultMinReplicas: 2,
    awsAccountId: '111111',
    awsAccountRegion: 'eu-west-1',
    feature: 'chicken-curry',
    global: {},
  },
) => {
  return { ...options }
}

describe('Feature jobs', () => {
  let job: FeatureKubeJob
  let dev: EnvironmentConfig

  beforeEach(async () => {
    const dependency = service('dependency')
      .namespace('A')
      .initContainer({
        containers: [
          {
            command: 'node',
          },
        ],
        postgres: {
          extensions: ['multiple', 'extensions'],
        },
      })

    const apiService = service('graphql')
      .env({
        A: ref((h) => `${h.svc(dependency)}`),
      })
      .initContainer({
        containers: [
          {
            command: 'node',
          },
        ],
        postgres: {
          extensions: ['single-extension'],
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
    const services = await getFeatureAffectedServices(
      [apiService, dependency],
      [dependency],
      [],
      dev,
    )
    job = await renderHelmJobForFeature(
      dev,
      `${dev.feature}`,
      services.included,
    )
  })

  it('contains DB_EXTENSIONS env', () => {
    expect(job.spec.template.spec.containers).toEqual([
      {
        command: ['/app/create-db.sh'],
        env: [
          { name: 'PGHOST', value: 'aurora' },
          { name: 'PGDATABASE', value: 'postgres' },
          { name: 'PGUSER', value: 'root' },
          { name: 'PGPASSWORD_KEY', value: '/rds/vidspyrna/masterpassword' },
          { name: 'DB_USER', value: 'feature_chicken_curry_dependency' },
          { name: 'DB_NAME', value: 'feature_chicken_curry_dependency' },
          {
            name: 'DB_PASSWORD_KEY',
            value: '/k8s/feature-chicken-curry-dependency/DB_PASSWORD',
          },
          { name: 'DB_EXTENSIONS', value: 'multiple,extensions' },
        ],
        image: `web-chicken-curry`,
        name: 'feature-chicken-curry-dependency1',
        securityContext: { allowPrivilegeEscalation: false, privileged: false },
      },
      {
        command: ['/app/create-db.sh'],
        env: [
          { name: 'PGHOST', value: 'aurora' },
          { name: 'PGDATABASE', value: 'postgres' },
          { name: 'PGUSER', value: 'root' },
          { name: 'PGPASSWORD_KEY', value: '/rds/vidspyrna/masterpassword' },
          { name: 'DB_USER', value: 'feature_chicken_curry_graphql' },
          { name: 'DB_NAME', value: 'feature_chicken_curry_graphql' },
          {
            name: 'DB_PASSWORD_KEY',
            value: '/k8s/feature-chicken-curry-graphql/DB_PASSWORD',
          },
          { name: 'DB_EXTENSIONS', value: 'single-extension' },
        ],
        image: 'web-chicken-curry',
        name: 'feature-chicken-curry-graphql1',
        securityContext: { allowPrivilegeEscalation: false, privileged: false },
      },
    ])
  })
})
