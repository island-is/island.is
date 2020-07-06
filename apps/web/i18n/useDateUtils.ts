import { useMemo } from 'react'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import { useI18n } from './useI18n'
import { Locale } from './I18n'

const localeMap = {
  is: localeIS,
}

export const useDateUtils = () => {
  const { activeLocale } = useI18n()

  return useMemo(() => {
    const locale = localeMap[activeLocale]

    return {
      format: (date: Date, dateFormat: string, options = {}) =>
        format(date, dateFormat, { locale, ...options }),
      locale,
    }
  }, [activeLocale])
}
