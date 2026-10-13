import { service } from './dsl'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'

// Feature: auth-admin-web-dev-scaledown
// Feature deployments run in dev; the `feature` name routes rendering through
// featureDeployment. Non-default replica values keep the {1,1,1} cap distinct.
const baseEnv: Omit<EnvironmentConfig, 'type' | 'domain' | 'feature'> = {
  auroraHost: 'a',
  redisHost: 'b',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

// A feature deployment lives in dev and carries a `feature` name.
const Feature: EnvironmentConfig = {
  ...baseEnv,
  domain: 'dev01.devland.is',
  type: 'dev',
  feature: 'feature-A',
}

// Invoke the feature-deployment transform exactly as the rendering pipeline
// does (see prepareServicesForEnv in processing/rendering-pipeline.ts, which
// calls outputFormat.featureDeployment(service.serviceDef, env) for feature
// environments). This mutates serviceDef.replicaCount in place, so we read it
// back off the builder's serviceDef.
function featureReplicaCount(sut: ReturnType<typeof service>) {
  renderers.helm.featureDeployment(sut.serviceDef, Feature)
  return sut.serviceDef.replicaCount
}

// Feature deployments cap resolved values >= 1 to {1,1,1}, but honor a
// scale-to-zero dev block ({0,0,0}) verbatim.
describe('Feature: auth-admin-web-dev-scaledown, feature-deployment replica handling', () => {
  it('honors a scale-to-zero dev block ({0,0,0}) verbatim in a feature deployment', () => {
    // Per-env dev {0,0,0} with bypassReplicaClamp true, like auth-admin-web.
    const sut = service('auth-admin-web-like').replicaCount({
      dev: { min: 0, max: 0, default: 0 },
      prod: { min: 2, max: 10, default: 2 },
      bypassReplicaClamp: true,
    })

    expect(featureReplicaCount(sut)).toEqual({ min: 0, max: 0, default: 0 })
  })

  it('caps a positive per-env dev block ({2,5,3}) to {1,1,1} in a feature deployment', () => {
    // Existing cost-saving cap is preserved for resolved values >= 1.
    const sut = service('per-env-positive').replicaCount({
      dev: { min: 2, max: 5, default: 3 },
      prod: { min: 2, max: 10, default: 2 },
    })

    expect(featureReplicaCount(sut)).toEqual({ min: 1, max: 1, default: 1 })
  })

  it('caps a flat-form service ({2,10,2}) to {1,1,1} in a feature deployment (backwards compatible)', () => {
    const sut = service('flat-form').replicaCount({
      min: 2,
      max: 10,
      default: 2,
    })

    expect(featureReplicaCount(sut)).toEqual({ min: 1, max: 1, default: 1 })
  })
})
