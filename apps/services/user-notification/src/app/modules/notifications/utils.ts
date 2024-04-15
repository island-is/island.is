import { ContentfulLocale } from './locale.enum'

export const isDefined = <T>(x: T | null | undefined): x is T => x != null

export const mapStringToLocale = (
  locale: string | undefined,
): Locale | undefined => (locale === ContentfulLocale.EN ? ContentfulLocale.EN : Locale.IS)
