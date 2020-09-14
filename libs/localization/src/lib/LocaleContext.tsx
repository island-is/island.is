import React, { createContext, useState, useMemo, useEffect } from 'react'
import { IntlProvider } from 'react-intl'
import { useLazyQuery, QueryLazyOptions } from '@apollo/client'
import gql from 'graphql-tag'
import { difference, isEmpty, uniq } from 'lodash'
import { parseMessageId } from './parseMessageId'

export type Locale = 'is' | 'en'

export const supportedLocales = ['is', 'en']
export const defaultLanguage: Locale = 'is'

interface MessagesDict {
  [key: string]: string
}

interface LocaleContextType {
  lang: Locale
  loadMessages: (namespaces: string | string[], lang: Locale) => void
  loadingMessages: boolean
}

interface LocaleProviderProps {
  locale: Locale
  messages: MessagesDict
  children: React.ReactElement
}

export async function polyfill(locale: string) {
  console.log('POLIFilled')
  await import('@formatjs/intl-pluralrules/polyfill-force')
  await import(`@formatjs/intl-pluralrules/locale-data/is`)

  await import(`@formatjs/intl-numberformat/locale-data/is`)
  await import('@formatjs/intl-numberformat/polyfill-force')

  await import(`@formatjs/intl-datetimeformat/add-all-tz`)
  await import('@formatjs/intl-datetimeformat/locale-data/is')
  await import('@formatjs/intl-datetimeformat/polyfill-force')

  await import(`@formatjs/intl-relativetimeformat/locale-data/is`)
  await import(`@formatjs/intl-relativetimeformat/polyfill-force`)
}

export const LocaleContext = createContext<LocaleContextType | null>(null)

const GET_TRANSLATIONS = gql`
  query GetTranslations($input: GetTranslationsInput!) {
    getTranslations(input: $input)
  }
`

export const LocaleProvider = ({
  children,
  locale = defaultLanguage,
  messages = {},
}: LocaleProviderProps) => {
  const [activeLocale, setActiveLocale] = useState<Locale>(
    locale || defaultLanguage,
  )
  const [messagesDict, setMessagesDict] = useState<MessagesDict>({})
  const [loadedNamespaces, setLoadedNamespaces] = useState<String[]>([])

  const [fetchMessages, { loading: loadingMessages, data }] = useLazyQuery(
    GET_TRANSLATIONS,
  )

  useEffect(() => {
    extractNamespaces(messagesDict)
  }, [messagesDict])

  useEffect(() => {
    accumulateMessages(locale, messages, data?.getTranslations ?? {})
  }, [locale, messages, data])

  // const messagesDict = useMemo(
  //   () => accumulateMessages(locale, messages, data?.getTranslations ?? {}),
  //   [locale, messages, data],
  // )

  // const loadedNamespaces = useMemo(() => extractNamespaces(messagesDict), [
  //   messagesDict,
  // ])

  const loadMessages = (namespaces: string | string[], lang: Locale) => {
    const namespaceArr =
      typeof namespaces === 'string' ? [namespaces] : namespaces
    const diff = difference(namespaceArr, loadedNamespaces)

    console.log('compare', namespaceArr, loadedNamespaces)
    console.log('diff', diff)

    // Only fetch namespaces that we have not fetched yet
    if (!isEmpty(diff)) {
      fetchMessages({
        variables: {
          input: {
            namespaces: diff,
            lang,
          },
        },
      })
    }
  }

  function extractNamespaces(dict: MessagesDict) {
    setLoadedNamespaces(
      uniq(Object.keys(dict).map((d) => parseMessageId(d).namespace)),
    )
  }

  function accumulateMessages(
    locale: Locale,
    messages: MessagesDict,
    messagesFromQuery: any,
  ) {
    if (locale !== activeLocale) {
      console.log('LOCALE is changing', messages)
      // locele changed, reset messages
      setActiveLocale(locale)
      setMessagesDict(messages)
    } else {
      // accumulated messages

      console.log('I HAVE,', messagesDict, messages, messagesFromQuery)
      console.log(
        'AND IT BECOMES THIS',
        Object.assign({}, messagesDict, messages, messagesFromQuery),
      )
      setMessagesDict(
        Object.assign({}, messagesDict, messages, messagesFromQuery),
      )
    }
  }

  console.log(
    'messagesDictMemo',
    loadingMessages,
    messagesDict,
    loadedNamespaces,
  )

  return (
    <LocaleContext.Provider
      value={{
        lang: activeLocale,
        loadMessages,
        loadingMessages,
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
