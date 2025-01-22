import { useMemo } from 'react'
import format from 'date-fns/format'
import localeEN from 'date-fns/locale/en-GB'
import localeIS from 'date-fns/locale/is'

import { useI18n } from './useI18n'

const localeMap = {
  is: localeIS,
  en: localeEN,
}

export const useDateUtils = () => {
  const { activeLocale } = useI18n()

  return useMemo(() => {
    const locale = localeMap[activeLocale]

    return {
      format: (date: Date, dateFormat: string, options = {}) =>
        format(date, dateFormat, { locale, ...options }),

      /**
       * returns the name of the (0-indexed) month according to the current locale for this month
       */
      getMonthByIndex: (idx: number) => {
        // the exact day of month doesnt matter, since we mostly care about > 1 (1st / 0th of some
        // months can produce the month before when timezones dont match)
        const d = new Date(0, idx, 2)

        return format(d, 'MMMM', { locale })
      },

      locale,
    }
  }, [activeLocale])
}
