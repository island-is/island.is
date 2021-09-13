import React from 'react'
import { IntlProvider } from 'react-intl'
import { en } from '../messages/en'
import { is } from '../messages/is'

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = 'is';

  return (
    <IntlProvider
      locale={locale}
      messages={is}
      onError={(err) => {
        if (__DEV__) {
          // console.log(err);
        }
      }}
    >
      {children}
    </IntlProvider>
  )
}
