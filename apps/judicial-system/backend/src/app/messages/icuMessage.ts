import type { PrimitiveType } from 'intl-messageformat'
import { IntlMessageFormat } from 'intl-messageformat'

/**
 * Interpolate an ICU message template without looking it up in the CMS
 * catalog (avoids MISSING_TRANSLATION warnings from Nest FormatMessage).
 */
export const formatIcuMessage = (
  message: string,
  values?: Record<string, PrimitiveType>,
): string => {
  const formatted = new IntlMessageFormat(message, 'is').format(values)

  if (typeof formatted === 'string') {
    return formatted
  }

  if (Array.isArray(formatted)) {
    return formatted.join('')
  }

  return String(formatted)
}
