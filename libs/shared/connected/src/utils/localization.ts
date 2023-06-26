import localeIS from 'date-fns/locale/is'
import localeEN from 'date-fns/locale/en-GB'
import format from 'date-fns/format'

import { Locale } from '@island.is/shared/types'

export function useLocalization(localizedJson = {}) {
  return (key: string, fallback?: string) => {
    return (
      (localizedJson && localizedJson[key as keyof typeof localizedJson]) ??
      fallback ??
      key
    )
  }
}

const localeMap = {
  is: localeIS,
  en: localeEN,
}

export function useDateFormat(activeLocale: Locale) {
  const locale = localeMap[activeLocale]
  return (date: Date, dateFormat: string, options = {}) =>
    format(date, dateFormat, { locale, ...options })
}
