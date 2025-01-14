import { EditorExtensionSDK } from '@contentful/app-sdk'

const getFieldApiForLocale = (
  locale: string,
  sdk: EditorExtensionSDK,
  fieldName: keyof typeof sdk.entry.fields,
) => {
  return {
    ...sdk,
    field: sdk.entry.fields[fieldName].getForLocale(locale),
  }
}

export const mapLocalesToFieldApis = (
  locales: string[],
  sdk: EditorExtensionSDK,
  fieldName: string,
) => {
  const mapping = new Map<string, ReturnType<typeof getFieldApiForLocale>>()

  for (const locale of locales) {
    mapping.set(locale, getFieldApiForLocale(locale, sdk, fieldName))
  }

  return Object.fromEntries(mapping)
}
