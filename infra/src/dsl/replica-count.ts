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

/**
 * Validate a single `{ min, max, default }` block: each field must be an integer
 * within `[0, 1000]`, `min <= max`, and `min <= default <= max`. `label`
 * identifies the offending block in error messages (e.g. `replicaCount` or
 * `replicaCount.dev`).
 */
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

/**
 * Reject a per-environment block that carries any key other than
 * `min`/`max`/`default`, naming the offending field (Requirement 1.4).
 */
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
 * Validate a `replicaCount` configuration in either the flat or per-environment
 * form before it is recorded on a service definition. Throws on any failure so
 * that nothing is stored (Requirements 1.1, 1.2, 1.3, 1.4, 1.6, 4.1).
 *
 * Global options (`scalingMagicNumber`, `cpuAverageUtilization`,
 * `bypassReplicaClamp`) are not range-checked.
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
