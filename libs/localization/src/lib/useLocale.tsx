import { useContext } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'

import { LocaleContext } from './LocaleContext'

export function useLocale() {
  const intl = useIntl()
  const { lang, changeLanguage } = useContext(LocaleContext)

  function formatMessage(
    descriptor: MessageDescriptor | string,
    values?: any,
  ): string {
    if (!descriptor || typeof descriptor === 'string') {
      return descriptor as string
    }

    return intl.formatMessage(descriptor, values)
  }

  function formatDateFns(date: string | number | Date, str = 'dd MMM yyyy') {
    const locale = lang === 'en' ? en : is
    const parsedDate =
      typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date

    return format(parsedDate, str, { locale })
  }

  return {
    ...intl,
    formatMessage,
    formatDateFns,
    lang,
    changeLanguage,
  }
}

export default useLocale
