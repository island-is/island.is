import { IntlMessageFormat } from 'intl-messageformat'

/**
 * Interpolate an ICU message template without looking it up in the CMS
 * catalog (avoids MISSING_TRANSLATION warnings from Nest FormatMessage).
 */
export const formatIcuMessage = (
  message: string,
  values?: Record<string, unknown>,
): string => {
  const formatted = new IntlMessageFormat(message, 'is').format(values)

  return typeof formatted === 'string' ? formatted : formatted.join('')
}
