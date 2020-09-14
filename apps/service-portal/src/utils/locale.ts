import { LanguageCode } from '@island.is/service-portal/core'

export const determineInitialLocale = (): LanguageCode => {
  const localStorageKey = localStorage.getItem('lang') as LanguageCode | null
  return localStorageKey || 'is'
}

export const setLangInLocalStore = (value: LanguageCode) => {
  localStorage.setItem('lang', value)
}
