import React from 'react'
import { IntlProvider, createIntl } from 'react-intl'
import { en } from '../../messages/en'
import { is } from '../../messages/is'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'

export const getIntl = () => {
  const { locale } = preferencesStore.getState()
  return createIntl({
    locale,
    messages: locale === 'is-IS' ? is : en,
    onError() {
      // noop
    },
    timeZone: 'UTC',
  })
}

/**
 * For text inside the system's own dialogs, like the Face ID prompt. The rest
 * of those is in the phone's language, which can't be Icelandic on iOS, so
 * this follows the phone rather than the app.
 */
export const getSystemIntl = () => {
  const phoneLocale = Intl.DateTimeFormat().resolvedOptions().locale
  const locale = phoneLocale.startsWith('is') ? 'is-IS' : 'en-US'
  return createIntl({
    locale,
    messages: locale === 'is-IS' ? is : en,
    onError() {
      // noop
    },
    timeZone: 'UTC',
  })
}

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = usePreferencesStore()

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
