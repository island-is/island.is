import {
  isPerEnvReplicaCount,
  PerEnvReplicaCount,
  ReplicaBounds,
  ReplicaCount,
} from './types/input-types'

const MIN_REPLICAS = 0
const MAX_REPLICAS = 1000

const ALLOWED_BOUND_KEYS: (keyof ReplicaBounds)[] = ['default', 'max', 'min']

const PER_ENV_BLOCKS: (keyof Pick<
  PerEnvReplicaCount,
  'dev' | 'staging' | 'prod'
>)[] = ['dev', 'staging', 'prod']

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}

// Validate a { min, max, default } block: integers in [0, 1000], min <= max, min <= default <= max.
function validateBounds(bounds: ReplicaBounds, label: string): void {
  for (const key of ALLOWED_BOUND_KEYS) {
    const value = bounds[key]
    if (!isInteger(value)) {
      throw new Error(
        `${label}.${key} must be an integer, got ${JSON.stringify(value)}`,
      )
    }
    if (value < MIN_REPLICAS || value > MAX_REPLICAS) {
      throw new Error(
        `${label}.${key} must be within [${MIN_REPLICAS}, ${MAX_REPLICAS}], got ${value}`,
      )
    }
  }

  const { min, max, default: def } = bounds
  if (min > max) {
    throw new Error(`${label}.min (${min}) must be <= ${label}.max (${max})`)
  }
  if (def < min || def > max) {
    throw new Error(
      `${label}.default (${def}) must be within [${label}.min (${min}), ${label}.max (${max})]`,
    )
  }
}

// Reject a per-env block that carries any key other than min/max/default.
function validateBlockKeys(block: object, label: string): void {
  for (const key of Object.keys(block)) {
    if (!ALLOWED_BOUND_KEYS.includes(key as keyof ReplicaBounds)) {
      throw new Error(
        `${label} contains disallowed field '${key}'; only 'min', 'max', and 'default' are permitted`,
      )
    }
  }
}

/**
 * Validate a replicaCount config (flat or per-environment) before it is stored.
 * Throws on any invalid value so nothing is recorded. Global options
 * (scalingMagicNumber, cpuAverageUtilization, bypassReplicaClamp) are not range-checked.
 */
export function validateReplicaCount(replicaCount: ReplicaCount): void {
  if (isPerEnvReplicaCount(replicaCount)) {
    for (const env of PER_ENV_BLOCKS) {
      const block = replicaCount[env]
      if (!block) {
        continue
      }
      const label = `replicaCount.${env}`
      validateBlockKeys(block, label)
      validateBounds(block, label)
    }
    return
  }

  validateBounds(replicaCount, 'replicaCount')
}
