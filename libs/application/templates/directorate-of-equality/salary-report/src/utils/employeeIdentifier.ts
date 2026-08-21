const IDENTIFIER_MIN_ORDINAL_DIGITS = 3
const IDENTIFIER_PREFIX_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Deterministic 3-letter prefix from the application id, so it's stable
// across reloads/screens for the same report without any backend change.
const identifierPrefix = (applicationId: string): string => {
  let hash = 0
  for (let i = 0; i < applicationId.length; i++) {
    hash = (hash * 31 + applicationId.charCodeAt(i)) >>> 0
  }
  return Array.from({ length: 3 }, () => {
    const letter =
      IDENTIFIER_PREFIX_LETTERS[hash % IDENTIFIER_PREFIX_LETTERS.length]
    hash = Math.floor(hash / IDENTIFIER_PREFIX_LETTERS.length)
    return letter
  }).join('')
}

// Mirrors the DMR backend's Excel-import identifier format (ABC-000) so
// employees read the same way on every screen, even though these employees
// never go through that import path.
export const formatEmployeeIdentifier = (
  applicationId: string,
  ordinal: number,
): string => {
  const width = Math.max(IDENTIFIER_MIN_ORDINAL_DIGITS, String(ordinal).length)
  return `${identifierPrefix(applicationId)}-${String(ordinal).padStart(
    width,
    '0',
  )}`
}
