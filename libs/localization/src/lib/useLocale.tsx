import { ReactNode, useContext } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'

import { LocaleContext } from './LocaleContext'
import { FormatMessage } from './types'

export function useLocale() {
  const intl = useIntl()
  const { lang, changeLanguage } = useContext(LocaleContext)

  const formatMessage = ((
    descriptor: MessageDescriptor | string | undefined,
    values?: any, // FormatMessageValues | FormatMessageValuesWReact,
  ): string | ReactNode | undefined => {
    if (!descriptor || typeof descriptor === 'string') {
      return descriptor as string
    }
    return intl.formatMessage(descriptor, values)
  }) as FormatMessage

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
