export interface TranslatedValue {
  locale: string
  value: string
}

export interface PublicAuthTenant {
  id: string
  nationalId?: string
  displayName: TranslatedValue[]
}

export interface PublicAuthScope {
  scopeName: string
  displayName: TranslatedValue[]
  description: TranslatedValue[]
}

export const getTranslation = (
  values: TranslatedValue[],
  locale: string,
): string =>
  values.find((translation) => translation.locale === locale)?.value ??
  values[0]?.value ??
  ''
