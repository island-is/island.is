import React, { createContext, useContext, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { shouldPolyfill } from '@formatjs/intl-datetimeformat/should-polyfill'

export type Locale = 'is' | 'en'

export const supportedLocales = ['is', 'en']
export const defaultLanguage: Locale = 'is'

interface MessagesDict {
  [key: string]: string
}

interface LocaleContextType {
  lang: Locale
  messages: MessagesDict
}

interface LocaleProviderProps {
  locale: Locale
  messages: MessagesDict
  children: React.ReactElement
}

export async function polyfill(locale: string) {
  if (shouldPolyfill()) {
    // Load the polyfill 1st BEFORE loading data
    await Promise.all([
      import('@formatjs/intl-datetimeformat/polyfill'),
      import('@formatjs/intl-numberformat/polyfill'),
      import('@formatjs/intl-relativetimeformat/polyfill'),
    ])
  }

  const imports = [import(`@formatjs/intl-relativetimeformat/locale-data/is`)]

  if (Intl.DateTimeFormat) {
    // Parallelize CLDR data loading
    console.log('load polifyll......')
    imports.push(import('@formatjs/intl-datetimeformat/add-all-tz'))
    imports.push(import(`@formatjs/intl-datetimeformat/locale-data/is`))
  }

  if (Intl.NumberFormat) {
    // Parallelize CLDR data loading
    console.log('load polifyll......', Intl.NumberFormat)
    imports.push(import(`@formatjs/intl-numberformat/locale-data/is`))
  }

  await Promise.all(imports)
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export const LocaleProvider = ({
  children,
  locale = defaultLanguage,
  messages = {},
}: LocaleProviderProps) => {
  const [messagesDict, setMessagesDict] = useState(messages)
  const [activeLocale, setActiveLocale] = useState<Locale>(
    locale || defaultLanguage,
  )

  useEffect(() => {
    async function loadMessages() {
      if (locale !== activeLocale) {
        setMessagesDict(messages)
      } else {
        const accumulatedTranslations = Object.entries(messages).reduce(
          (arr, [key, val]) => ({
            ...arr,
            [key]: val,
          }),
          messagesDict,
        )
        setMessagesDict(accumulatedTranslations)
      }
    }

    loadMessages()
  }, [locale, messages])

  useEffect(() => {
    console.log('locale', locale)
    setActiveLocale(locale)
  }, [locale])

  console.log('messagesDict', messagesDict)

  return (
    <LocaleContext.Provider
      value={{
        messages: messagesDict,
        lang: activeLocale,
      }}
    >
      <IntlProvider
        locale={activeLocale}
        messages={messagesDict}
        defaultLocale={defaultLanguage}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}

export const useTranslations = () => useContext(LocaleContext)
