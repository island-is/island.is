import format from 'date-fns/format'
import localeEN from 'date-fns/locale/en-GB'
import localeIS from 'date-fns/locale/is'

import { Locale } from '@island.is/shared/types'

export const formatDate = (
  date: Date,
  locale: Locale,
  stringFormat = 'dd. MMMM yyyy',
): string | undefined => {
  try {
    return format(date, stringFormat, {
      locale: locale === 'is' ? localeIS : localeEN,
    })
  } catch (e) {
    console.warn('Error formatting date')
    return
  }
}
