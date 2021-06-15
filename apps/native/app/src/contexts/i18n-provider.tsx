import React from 'react'
import { IntlProvider } from '../lib/intl'
import { en } from '../messages/en'
import { is } from '../messages/is'
import { usePreferencesStore } from '../stores/preferences-store'

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = usePreferencesStore()

  return (
    <IntlProvider
      locale={locale}
      messages={locale === 'is-IS' ? is : en}
      onError={() => null}
    >
      {children}
    </IntlProvider>
  )
}
