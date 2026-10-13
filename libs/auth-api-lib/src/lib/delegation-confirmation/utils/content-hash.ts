import { createHash } from 'crypto'

import type { ConfirmationContentSnapshot } from '../types/delegation-confirmation-content'

/** Stored with each hash, so old rows stay verifiable if this changes. */
export const CONTENT_HASH_ALG = 'sha256'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/** RFC 8785, plus NFC-normalised strings; non-integer numbers are refused. */
const canonicalize = (value: JsonValue): string => {
  if (value === null) {
    return 'null'
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      throw new Error(
        'Cannot canonicalize a non-integer number: the canonical form of floating point values is not supported.',
      )
    }
    return String(value)
  }

  if (typeof value === 'string') {
    return JSON.stringify(value.normalize('NFC'))
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`
  }

  const keys = Object.keys(value)
    .filter((key) => value[key] !== undefined)
    .sort()

  return `{${keys
    .map(
      (key) =>
        `${JSON.stringify(key.normalize('NFC'))}:${canonicalize(value[key])}`,
    )
    .join(',')}}`
}

export const canonicalizeForHash = canonicalize

export const hashConfirmationGroup = (contentHashes: string[]): string => {
  if (contentHashes.length === 1) {
    return contentHashes[0]
  }
  return createHash(CONTENT_HASH_ALG)
    .update(canonicalize([...contentHashes].sort()), 'utf8')
    .digest('hex')
}

export const hashConfirmationContent = (
  snapshot: ConfirmationContentSnapshot,
): string =>
  createHash(CONTENT_HASH_ALG)
    .update(canonicalize(snapshot as unknown as JsonValue), 'utf8')
    .digest('hex')
