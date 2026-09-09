import { service } from './dsl'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'

// Feature-deployment environment fixture. Feature deployments run in the `dev`
// environment; the presence of `feature` is what routes the rendering pipeline
// through `HelmOutput.featureDeployment` (see rendering-pipeline.ts). The
// non-default replica values are chosen so the cost-saving cap to {1,1,1} is
// always distinguishable from resolved values.
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

// Feature: auth-admin-web-dev-scaledown — feature-deployment replica handling.
//
// Feature deployments keep the existing cost-saving cap of Math.min(1, ...) for
// resolved values >= 1, but when the resolved dev block is scale-to-zero
// (max === 0), the feature deployment honors dev verbatim and produces
// {0,0,0} (new scale-to-zero-in-feature behavior). Because feature deployments
// run in dev, resolveReplicaCount already returns the dev block.
// Validates: Requirements 6.1, 6.2, 6.3 (cap preserved) plus the new
// scale-to-zero-in-feature behavior.
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
