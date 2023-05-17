import { AuthAdminTranslatedValue } from '@island.is/api/schema'

export const getTranslatedValue = (
  translatedValue: AuthAdminTranslatedValue[],
  locale: string,
) => {
  return translatedValue.find(({ locale: l }) => l === locale)?.value || ''
}
