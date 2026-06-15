import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export const formatCurrency = (value?: number | null): string =>
  `${(value ?? 0).toLocaleString('is-IS')} kr.`

export const formatWorkRatio = (ratio?: number | null): string =>
  `${Math.round((ratio ?? 0) * 100)}%`

// The server masks each employee's national id with a per-application code
// like "DTH-008" (shared prefix + ordinal). There's no separate code field in
// the parsed report, so we derive the prefix from the existing employees'
// identifiers. Falls back to "AAA" when there are none to derive from.
export const deriveIdentifierPrefix = (
  employees: { identifier?: string }[],
): string => {
  for (const e of employees) {
    const match = e.identifier?.match(/^(.*?)(\d+)$/)
    if (match) return match[1]
  }
  return 'AAA'
}

// Masked identifier for manually-added employees (the real national id is
// never collected), using the same prefix as the imported employees.
export const computeIdentifier = (prefix: string, ordinal: number): string =>
  `${prefix}${String(ordinal).padStart(3, '0')}`

export const formatStartDate = (value?: string): string => {
  if (!value) return ''
  try {
    return format(parseISO(value), 'd.M.yyyy')
  } catch {
    return value
  }
}
