import { createHash } from 'crypto'

import type { ConfirmationContentSnapshot } from '../types/delegation-confirmation-content'

/**
 * The digest algorithm recorded alongside every hash. When this changes, old
 * rows keep their recorded algorithm and stay verifiable — never re-hash a
 * confirmed row.
 */
export const CONTENT_HASH_ALG = 'sha256'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * Canonicalises a value following RFC 8785 (JSON Canonicalization Scheme) for
 * the value space we actually use: objects, arrays, strings, integers,
 * booleans and null.
 *
 * Two deliberate constraints beyond the RFC:
 *
 * - Strings are normalised to Unicode NFC. The RFC leaves normalisation to the
 *   application, but Icelandic display names reach us from several sources and
 *   the same visible text must always hash identically.
 * - Non-integer and non-finite numbers throw rather than being serialised. The
 *   RFC's number rules are subtle and we have no need for them, so we refuse
 *   instead of silently producing something we cannot re-derive.
 */
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

  // Object keys are sorted by UTF-16 code unit, which is what String
  // comparison does in JavaScript.
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

/** Exposed for tests; production code should use `hashConfirmationContent`. */
export const canonicalizeForHash = canonicalize

/**
 * Computes the digest that binds a confirmation to the exact grant the grantor
 * was shown. Recomputed at redemption time and compared against the stored
 * value, so a confirmation cannot be moved onto a different set of scopes.
 */
export const hashConfirmationContent = (
  snapshot: ConfirmationContentSnapshot,
): string =>
  createHash(CONTENT_HASH_ALG)
    .update(canonicalize(snapshot as unknown as JsonValue), 'utf8')
    .digest('hex')
