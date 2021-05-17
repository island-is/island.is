import React from 'react'
import { IntlProvider } from 'react-intl'
import { is } from '../messages/is';
import { en } from '../messages/en';
import { usePreferencesStore } from '../stores/preferences-store'

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = usePreferencesStore()
  return (
    <IntlProvider locale={locale} messages={locale === 'is-IS' ? is : en}>
      {children}
    </IntlProvider>
  )
}
