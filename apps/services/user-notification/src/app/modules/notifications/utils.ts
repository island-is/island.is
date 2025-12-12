import type { Locale } from '@island.is/shared/types'
import { localeMap } from '@island.is/cms'

export const isDefined = <T>(x: T | null | undefined): x is T => x != null
export const mapToLocale = (locale: string): Locale =>
  locale === 'en' ? 'en' : 'is'
export const mapToContentfulLocale = (locale: Locale): string =>
  locale === 'en' ? 'en' : 'is-IS'
export const cleanString = (str: string): string =>
  str.replace(/\s+/g, ' ').trim()

export const extractLocaleField = (
  field: string | Record<string, string> | undefined | null,
  locale: Locale,
  fallback = '',
): string => {
  if (!field) return fallback
  if (typeof field === 'string') return field
  const contentfulLocaleCode = localeMap[locale] || 'is-IS'
  return field[contentfulLocaleCode] || field['is-IS'] || fallback
}
