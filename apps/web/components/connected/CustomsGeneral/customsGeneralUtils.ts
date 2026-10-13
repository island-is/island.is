import { formatDate } from '@island.is/web/utils/formatDate'

export const formatValidityDate = (
  iso: string,
  indefinite: string,
  locale: string,
): string => {
  if (!iso) return indefinite
  const d = new Date(iso)
  if (isNaN(d.getTime()) || d.getFullYear() >= 2200) return indefinite
  return formatDate(d, locale as 'is' | 'en', 'dd.MM.yyyy') ?? indefinite
}

/**
 * Formats a numeric value the way the customs pages expect it. The API sends
 * numbers as strings with a dot separator ("27.73"), which has to become a
 * comma on the Icelandic site.
 */
export const formatNumber = (
  value: string | number | null | undefined,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string => {
  if (value === null || value === undefined || value === '') return ''
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!isFinite(parsed)) return typeof value === 'string' ? value : ''
  return new Intl.NumberFormat(locale, options).format(parsed)
}
