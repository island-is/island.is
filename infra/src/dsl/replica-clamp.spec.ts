import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'
import { PerEnvReplicaCount, ReplicaBounds } from './types/input-types'

// Base environment fixtures. `type` drives clamp/resolution behavior in the
// generator; the non-default replica values are chosen so a clamp to
// { min: 1, max: 2, default: 1 } is always distinguishable from resolved
// values.
const baseEnv: Omit<EnvironmentConfig, 'type' | 'domain'> = {
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

// Deterministic, seeded RNG (mulberry32) so property runs are reproducible.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const RUNS = 150

function randInt(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1))
}

// A valid ReplicaBounds block with 0 <= min <= default <= max <= 1000.
function randBounds(rng: () => number): ReplicaBounds {
  const min = randInt(rng, 0, 20)
  const max = min + randInt(rng, 0, 20)
  const def = randInt(rng, min, max)
  return { min, max, default: def }
}

// A random per-env config where any subset of blocks may be present.
function randPerEnvConfig(rng: () => number): PerEnvReplicaCount {
  const cfg: PerEnvReplicaCount = {}
  if (rng() < 0.85) cfg.dev = randBounds(rng)
  if (rng() < 0.85) cfg.staging = randBounds(rng)
  if (rng() < 0.85) cfg.prod = randBounds(rng)
  return cfg
}

// A random flat config with valid bounds.
function randFlatBounds(rng: () => number): ReplicaBounds {
  return randBounds(rng)
}

async function generate(
  sut: ReturnType<typeof service>,
  env: EnvironmentConfig,
): Promise<SerializeSuccess<HelmService>> {
  return (await generateOutputOne({
    outputFormat: renderers.helm,
    service: sut,
    runtime: new Kubernetes(env),
    env,
  })) as SerializeSuccess<HelmService>
}

const CLAMP = { min: 1, max: 2, default: 1 }

// Feature: auth-admin-web-dev-scaledown, Property 7: Dev/staging clamp
// overrides resolved values without bypass — for any service generated for
// `dev` or `staging` whose name does not include `search-indexer` and for
// which bypassReplicaClamp is not set, the output replicaCount equals
// { min: 1, max: 2, default: 1 } regardless of the resolved per-env values.
// Validates: Requirements 5.1
describe('Feature: auth-admin-web-dev-scaledown, Property 7: dev/staging clamp overrides resolved values without bypass', () => {
  it('clamps to {1,2,1} for random per-env configs in dev and staging (no bypass)', async () => {
    for (let seed = 1; seed <= RUNS; seed++) {
      const rng = mulberry32(seed)
      const cfg = randPerEnvConfig(rng)
      // Force a valid dev/staging block so resolved values differ from clamp.
      cfg.dev = { min: 3, max: 8, default: 5 }
      cfg.staging = { min: 4, max: 9, default: 6 }
      // bypassReplicaClamp deliberately NOT set.

      const sut = service(`svc-${seed}`).replicaCount(cfg)

      const devResult = await generate(sut, Dev)
      const stagingResult = await generate(sut, Staging)

      expect(devResult.serviceDef[0].replicaCount).toEqual(CLAMP)
      expect(stagingResult.serviceDef[0].replicaCount).toEqual(CLAMP)
    }
  })

  it('clamps flat-form configs in dev and staging (no bypass)', async () => {
    for (let seed = 1; seed <= RUNS; seed++) {
      const rng = mulberry32(seed + 10_000)
      // Keep min >= 1 so the clamp (not scale-to-zero) is what we observe.
      const min = randInt(rng, 1, 20)
      const max = min + randInt(rng, 1, 20)
      const def = randInt(rng, min, max)
      const sut = service(`flat-${seed}`).replicaCount({
        min,
        max,
        default: def,
      })

      const devResult = await generate(sut, Dev)
      const stagingResult = await generate(sut, Staging)

      expect(devResult.serviceDef[0].replicaCount).toEqual(CLAMP)
      expect(stagingResult.serviceDef[0].replicaCount).toEqual(CLAMP)
    }
  })
})

// Feature: auth-admin-web-dev-scaledown, Property 8: Bypass uses resolved
// values in both dev and staging — for any service with bypassReplicaClamp
// set, the output replicaCount for both dev and staging equals the resolved
// per-environment values rather than the clamp values.
// Validates: Requirements 5.2, 5.4
describe('Feature: auth-admin-web-dev-scaledown, Property 8: bypass uses resolved values in both dev and staging', () => {
  it('uses resolved per-env values in dev and staging when bypass is set', async () => {
    for (let seed = 1; seed <= RUNS; seed++) {
      const rng = mulberry32(seed + 20_000)
      // Use positive-max blocks so we compare against explicit resolved values
      // (max === 0 would trigger scale-to-zero normalization, covered elsewhere).
      const dev: ReplicaBounds = {
        min: randInt(rng, 1, 10),
        max: 0,
        default: 0,
      }
      dev.max = dev.min + randInt(rng, 0, 10)
      dev.default = randInt(rng, dev.min, dev.max)
      const staging: ReplicaBounds = {
        min: randInt(rng, 1, 10),
        max: 0,
        default: 0,
      }
      staging.max = staging.min + randInt(rng, 0, 10)
      staging.default = randInt(rng, staging.min, staging.max)

      const cfg: PerEnvReplicaCount = {
        dev,
        staging,
        bypassReplicaClamp: true,
      }
      const sut = service(`bypass-${seed}`).replicaCount(cfg)

      const devResult = await generate(sut, Dev)
      const stagingResult = await generate(sut, Staging)

      expect(devResult.serviceDef[0].replicaCount).toEqual(dev)
      expect(stagingResult.serviceDef[0].replicaCount).toEqual(staging)
    }
  })

  it('bypass in dev/staging with a missing block falls back to env defaults, not the clamp', async () => {
    for (let seed = 1; seed <= RUNS; seed++) {
      const rng = mulberry32(seed + 25_000)
      // Only a prod block present; dev/staging omitted -> env defaults.
      const cfg: PerEnvReplicaCount = {
        prod: randBounds(rng),
        bypassReplicaClamp: true,
      }
      const sut = service(`bypass-fallback-${seed}`).replicaCount(cfg)

      const envDefaults = {
        min: Dev.defaultMinReplicas,
        max: Dev.defaultMaxReplicas,
        default: Dev.defaultMinReplicas,
      }

      const devResult = await generate(sut, Dev)
      const stagingResult = await generate(sut, Staging)

      expect(devResult.serviceDef[0].replicaCount).toEqual(envDefaults)
      expect(stagingResult.serviceDef[0].replicaCount).toEqual(envDefaults)
    }
  })
})

// Feature: auth-admin-web-dev-scaledown, Property 9: Prod never clamps — for
// any service generated for prod, the output replicaCount equals the resolved
// per-environment values (no clamp applied).
// Validates: Requirements 5.3
describe('Feature: auth-admin-web-dev-scaledown, Property 9: prod never clamps', () => {
  it('uses resolved prod values for random per-env configs (no bypass)', async () => {
    for (let seed = 1; seed <= RUNS; seed++) {
      const rng = mulberry32(seed + 30_000)
      // Positive-max prod block so output equals the explicit resolved values.
      const prod: ReplicaBounds = {
        min: randInt(rng, 1, 10),
        max: 0,
        default: 0,
      }
      prod.max = prod.min + randInt(rng, 0, 10)
      prod.default = randInt(rng, prod.min, prod.max)

      const cfg: PerEnvReplicaCount = { prod }
      // Randomly add unrelated dev/staging blocks to prove isolation.
      if (rng() < 0.5) cfg.dev = randBounds(rng)
      if (rng() < 0.5) cfg.staging = randBounds(rng)

      const sut = service(`prod-${seed}`).replicaCount(cfg)
      const prodResult = await generate(sut, Prod)

      expect(prodResult.serviceDef[0].replicaCount).toEqual(prod)
    }
  })

  it('uses flat-form values in prod (no clamp)', async () => {
    for (let seed = 1; seed <= RUNS; seed++) {
      const rng = mulberry32(seed + 35_000)
      const min = randInt(rng, 1, 20)
      const max = min + randInt(rng, 1, 20)
      const def = randInt(rng, min, max)
      const sut = service(`prod-flat-${seed}`).replicaCount({
        min,
        max,
        default: def,
      })

      const prodResult = await generate(sut, Prod)

      expect(prodResult.serviceDef[0].replicaCount).toEqual({
        min,
        max,
        default: def,
      })
    }
  })
})

// Example (existing exemption preserved): a service named `search-indexer` in
// dev is NOT clamped — it keeps its explicit/resolved replica values even
// without bypassReplicaClamp.
// Validates: Requirements 5.1 (search-indexer exemption)
describe('Feature: auth-admin-web-dev-scaledown, Property 7 example: search-indexer is not clamped in dev', () => {
  it('search-indexer keeps its resolved values in dev without bypass', async () => {
    const cfg: PerEnvReplicaCount = {
      dev: { min: 3, max: 8, default: 5 },
    }
    const sut = service('search-indexer').replicaCount(cfg)

    const devResult = await generate(sut, Dev)

    // Not clamped to {1,2,1}; uses the resolved dev block.
    expect(devResult.serviceDef[0].replicaCount).toEqual({
      min: 3,
      max: 8,
      default: 5,
    })
  })

  it('search-indexer flat form keeps its explicit values in dev', async () => {
    const sut = service('search-indexer-workers').replicaCount({
      min: 4,
      max: 6,
      default: 5,
    })

    const devResult = await generate(sut, Dev)

    expect(devResult.serviceDef[0].replicaCount).toEqual({
      min: 4,
      max: 6,
      default: 5,
    })
  })
})
