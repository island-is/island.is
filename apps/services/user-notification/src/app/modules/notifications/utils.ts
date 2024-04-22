import type { Locale } from '@island.is/shared/types'
export const isDefined = <T>(x: T | null | undefined): x is T => x != null
export const mapToLocale = (locale: string): Locale =>
  locale === 'en' ? 'en' : 'is'
export const mapToContentfulLocale = (locale: Locale): string => {
  return locale === 'en' ? 'en' : 'is-IS'
}
