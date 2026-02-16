import React from 'react'
import { IntlProvider } from 'react-intl'
import { en } from '../../messages/en'
import { is } from '../../messages/is'

const locale = 'is-IS'

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <IntlProvider
      locale={locale}
      messages={locale === 'is-IS' ? is : en}
      onError={(err) => {
        if (__DEV__) {
          console.log(err)
        }
      }}
      timeZone="UTC"
    >
      {children}
    </IntlProvider>
  )
}
