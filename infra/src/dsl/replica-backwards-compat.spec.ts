import { service, ServiceBuilder } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { generateOutputOne } from './processing/rendering-pipeline'
import { EnvironmentConfig } from './types/charts'
import { HelmService, SerializeSuccess } from './types/output-types'
import { renderers } from './upstream-dependencies'

/**
 * Feature: auth-admin-web-dev-scaledown, Property 1: Flat-form output equals baseline
 *
 * These tests lock in the *pre-feature* behavior of the Helm generator for
 * flat-form `replicaCount` services. Because the per-environment resolver runs
 * the flat form through as an identity transform, flat-form services must keep
 * producing byte-identical `replicaCount` / `hpa` output.
 *
 * The expected values below are a hardcoded baseline snapshot of what the OLD
 * flat logic produced, as documented in design.md:
 *   - dev/staging (non-`search-indexer`, no bypass): clamp -> {min:1,max:2,default:1},
 *     hpa present with replicas {1,2}, cpuAverageUtilization 90, nginxRequestsIrate 5
 *     (unless overridden by globals).
 *   - prod: uses the explicit/resolved values with an hpa; a service with no
 *     replicaCount falls back to the env defaults.
 *   - `search-indexer` services are exempt from the dev/staging clamp and use
 *     their explicit/resolved values there too.
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 */

const baseEnv = {
  auroraHost: 'a',
  redisHost: 'b',
  featuresOn: [],
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1' as const,
  global: {},
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
}

const Dev: EnvironmentConfig = {
  ...baseEnv,
  domain: 'dev01.devland.is',
  type: 'dev',
}

const Staging: EnvironmentConfig = {
  ...baseEnv,
  domain: 'staging01.devland.is',
  type: 'staging',
}

const Prod: EnvironmentConfig = {
  ...baseEnv,
  domain: 'island.is',
  type: 'prod',
}

const generate = async (
  sut: ServiceBuilder<string>,
  env: EnvironmentConfig,
): Promise<HelmService> => {
  const result = (await generateOutputOne({
    outputFormat: renderers.helm,
    service: sut,
    runtime: new Kubernetes(env),
    env,
  })) as SerializeSuccess<HelmService>
  return result.serviceDef[0]
}

// The HPA the old flat logic builds whenever resolved max >= 1, with default
// globals (cpuAverageUtilization || 90, nginxRequestsIrate = scalingMagicNumber || 5).
const hpaFor = (min: number, max: number) => ({
  scaling: {
    replicas: { min, max },
    metric: { cpuAverageUtilization: 90, nginxRequestsIrate: 5 },
  },
})

describe('Backwards-compatibility baseline: flat-form replicaCount', () => {
  describe('(a) explicit flat replicaCount {default:2, min:2, max:10} (pre-change auth-admin-web)', () => {
    const build = () =>
      service('auth-admin-web').replicaCount({
        default: 2,
        min: 2,
        max: 10,
      })

    it('dev clamps to {1,2,1} with an hpa (baseline)', async () => {
      const def = await generate(build(), Dev)
      expect(def.replicaCount).toStrictEqual({ min: 1, max: 2, default: 1 })
      expect(def.hpa).toStrictEqual(hpaFor(1, 2))
    })

    it('staging clamps to {1,2,1} with an hpa (baseline)', async () => {
      const def = await generate(build(), Staging)
      expect(def.replicaCount).toStrictEqual({ min: 1, max: 2, default: 1 })
      expect(def.hpa).toStrictEqual(hpaFor(1, 2))
    })

    it('prod uses explicit {2,10,2} with an hpa (baseline)', async () => {
      const def = await generate(build(), Prod)
      expect(def.replicaCount).toStrictEqual({ min: 2, max: 10, default: 2 })
      expect(def.hpa).toStrictEqual(hpaFor(2, 10))
    })
  })

  describe('(b) search-indexer service (clamp-exempt)', () => {
    const build = () =>
      service('search-indexer').replicaCount({
        default: 3,
        min: 3,
        max: 12,
      })

    it('dev is NOT clamped and uses explicit {3,12,3} with an hpa (baseline)', async () => {
      const def = await generate(build(), Dev)
      expect(def.replicaCount).toStrictEqual({ min: 3, max: 12, default: 3 })
      expect(def.hpa).toStrictEqual(hpaFor(3, 12))
    })

    it('staging is NOT clamped and uses explicit {3,12,3} with an hpa (baseline)', async () => {
      const def = await generate(build(), Staging)
      expect(def.replicaCount).toStrictEqual({ min: 3, max: 12, default: 3 })
      expect(def.hpa).toStrictEqual(hpaFor(3, 12))
    })

    it('prod uses explicit {3,12,3} with an hpa (baseline)', async () => {
      const def = await generate(build(), Prod)
      expect(def.replicaCount).toStrictEqual({ min: 3, max: 12, default: 3 })
      expect(def.hpa).toStrictEqual(hpaFor(3, 12))
    })
  })

  describe('(c) service with NO replicaCount (env-default fallback)', () => {
    const build = () => service('api')

    it('dev clamps to {1,2,1} with an hpa (baseline)', async () => {
      const def = await generate(build(), Dev)
      expect(def.replicaCount).toStrictEqual({ min: 1, max: 2, default: 1 })
      expect(def.hpa).toStrictEqual(hpaFor(1, 2))
    })

    it('staging clamps to {1,2,1} with an hpa (baseline)', async () => {
      const def = await generate(build(), Staging)
      expect(def.replicaCount).toStrictEqual({ min: 1, max: 2, default: 1 })
      expect(def.hpa).toStrictEqual(hpaFor(1, 2))
    })

    it('prod falls back to env defaults {defaultMinReplicas, defaultMaxReplicas, defaultMinReplicas} with an hpa (baseline)', async () => {
      const def = await generate(build(), Prod)
      expect(def.replicaCount).toStrictEqual({
        min: Prod.defaultMinReplicas,
        max: Prod.defaultMaxReplicas,
        default: Prod.defaultMinReplicas,
      })
      expect(def.hpa).toStrictEqual(
        hpaFor(Prod.defaultMinReplicas, Prod.defaultMaxReplicas),
      )
    })
  })

  describe('flat-form output shape (Requirements 2.3, 2.4)', () => {
    it('emits exactly the flat keys min/max/default with no nested replica structure', async () => {
      const def = await generate(
        service('api').replicaCount({ default: 2, min: 2, max: 10 }),
        Prod,
      )
      expect(def.replicaCount).toBeDefined()
      expect(Object.keys(def.replicaCount!).sort()).toStrictEqual([
        'default',
        'max',
        'min',
      ])
    })
  })
})
