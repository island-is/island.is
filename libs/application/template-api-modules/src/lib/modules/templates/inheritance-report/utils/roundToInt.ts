/**
 * Rounds a numeric value to the nearest integer
 * @param input - String or number to round
 * @returns Rounded integer as string or number (same type as input)
 * @throws Error if input is invalid
 */
export const roundToInt = (input: string | number): string | number => {
  if (typeof input === 'number') {
    if (!isFinite(input)) return input
    return Math.round(input)
  }

  const str = input?.toString().trim()
  if (!str) {
    throw new Error('Invalid numeric string: empty value')
  }

  // Reject any string containing characters other than digits, whitespace, '.', ',', '+', '-'
  if (!/^[0-9\s.,+-]+$/.test(str)) {
    throw new Error(`Invalid numeric string: ${input}`)
  }

  // Detect and normalize decimal/thousand separators
  let s = str.replace(/\s/g, '')
  const hasComma = s.includes(',')
  const hasDot = s.includes('.')

  if (hasComma && hasDot) {
    // Assume '.' thousand separator and ',' decimal
    s = s.replace(/\./g, '').replace(/,/g, '.')
  } else if (hasComma) {
    s = s.replace(/,/g, '.')
  }

  // Remove any characters not part of a JS numeric literal after normalization
  s = s.replace(/[^0-9.+-]/g, '')
  const parsed = Number(s)

  if (isNaN(parsed) || !isFinite(parsed)) {
    throw new Error(`Invalid numeric string: ${input}`)
  }

  return String(Math.round(parsed))
}

/**
 * Monetary field keys that should be rounded to integers
 */
const MONETARY_KEYS = new Set<string>([
  'propertyValuation',
  'value',
  'total',
  'publicCharges',
  'inheritance',
  'inheritanceTax',
  'taxableInheritance',
  'taxFreeInheritance',
  'spouseTotalDeduction',
  'spouseTotalSeparateProperty',
  'estateTotal',
  'totalDeduction',
  'debtsTotal',
  'netTotal',
  'spouseTotal',
  'netPropertyForExchange',
  'assetsTotal',
  // Funeral costs
  'build',
  'cremation',
  'print',
  'flowers',
  'music',
  'rent',
  'food',
  'tombstone',
  'service',
  // Business related (if present)
  'businessAssetValue',
  'debtValue',
])

/**
 * Keys that should be skipped from rounding
 */
const KEYS_TO_SKIP = new Set<string>([
  'shareTotal',
  'deceasedShareAmount',
  'amount',
  'exchangeRateOrInterest',
  'share',
])

/**
 * Recursively rounds monetary fields in an object to integers
 * @param value - The value to process (can be object, array, or primitive)
 * @param parentKey - The parent key name for context
 * @returns The processed value with monetary fields rounded
 */
export const roundMonetaryFieldsDeep = (
  value: unknown,
  parentKey?: string,
): unknown => {
  if (Array.isArray(value)) {
    return value.map((v) => roundMonetaryFieldsDeep(v))
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const out: Record<string, unknown> = {}

    for (const [key, v] of Object.entries(obj)) {
      if (KEYS_TO_SKIP.has(key)) {
        out[key] = roundMonetaryFieldsDeep(v, key)
        continue
      }

      if (MONETARY_KEYS.has(key)) {
        if (
          (typeof v === 'string' && v.trim() !== '') ||
          typeof v === 'number'
        ) {
          out[key] = roundToInt(v as string | number)
          continue
        }
      }

      out[key] = roundMonetaryFieldsDeep(v, key)
    }

    return out
  }

  // Primitive
  if (parentKey && MONETARY_KEYS.has(parentKey)) {
    if (
      (typeof value === 'string' && value.trim() !== '') ||
      typeof value === 'number'
    ) {
      return roundToInt(value as string | number)
    }
  }

  return value
}

/**
 * Converts all values in an object to strings
 * @param obj - The object to stringify
 * @returns Object with all values converted to strings
 */
export const stringifyObject = (
  obj: Record<string, unknown>,
): Record<string, string> => {
  const result: Record<string, string> = {}

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = obj[key] as string
    } else {
      result[key] = JSON.stringify(obj[key])
    }
  }

  return result
}
