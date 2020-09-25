import React, { createContext, useState, useEffect } from 'react'
import { IntlProvider } from 'react-intl'
import { useLazyQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { difference, isEmpty, uniq } from 'lodash'
import { polyfill } from './polyfills'

export type Locale = 'is' | 'en'

export const supportedLocales = ['is', 'en']
export const defaultLanguage: Locale = 'is'

export interface MessagesDict {
  [key: string]: string
}

interface LocaleContextType {
  lang: Locale
  loadMessages: (namespaces: string | string[]) => void
  changeLanguage: (lang: Locale) => void
  loadingMessages: boolean
  loadedNamespaces: string[]
  messages: MessagesDict
}

interface LocaleProviderProps {
  locale: Locale
  messages: MessagesDict
  children: React.ReactElement
}

export const LocaleContext = createContext<LocaleContextType>({
  lang: 'is',
  loadMessages: () => undefined,
  changeLanguage: () => undefined,
  loadingMessages: true,
  loadedNamespaces: [],
  messages: {},
})

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
  const [ready, setReady] = useState<boolean>(false)
  const [activeLocale, setActiveLocale] = useState<Locale>(
    locale || defaultLanguage,
  )
  const [messagesDict, setMessagesDict] = useState<MessagesDict>(messages)
  const [loadedNamespaces, setLoadedNamespaces] = useState<string[]>([])

  const [fetchMessages, { loading: loadingMessages, data }] = useLazyQuery(
    GET_TRANSLATIONS,
  )

  useEffect(() => {
    let mounted = true
    async function prepare() {
      await polyfill(locale)
    }

    if (!ready) {
      prepare().then(() => {
        if (mounted) {
          setReady(true)
        }
      })
    }
    return () => {
      mounted = false
    }
  }, [locale, ready])

  useEffect(() => {
    setActiveLocale(locale)
    setMessagesDict(messages)
  }, [locale])

  useEffect(() => {
    accumulateMessages(messages, data?.getTranslations ?? {})
  }, [messages, data])

  async function changeLanguage(lang: Locale) {
    await polyfill(lang)
    setMessagesDict({})
    setActiveLocale(lang)
    fetchMessages({
      variables: {
        input: {
          namespaces: loadedNamespaces,
          lang,
        },
      },
    })
  }

  const loadMessages = async (namespaces: string | string[]) => {
    const namespaceArr =
      typeof namespaces === 'string' ? [namespaces] : namespaces
    const diff = difference(namespaceArr, loadedNamespaces)

    // Only fetch namespaces that we have not fetched yet
    if (!isEmpty(diff)) {
      setLoadedNamespaces([...loadedNamespaces, ...diff])

      fetchMessages({
        variables: {
          input: {
            namespaces: diff,
            lang: activeLocale,
          },
        },
      })
    }
  }

  async function accumulateMessages(
    messages: MessagesDict,
    messagesFromQuery: any,
  ) {
    setMessagesDict(
      Object.assign({}, messagesDict, messages, messagesFromQuery),
    )
  }

  return (
    <LocaleContext.Provider
      value={{
        lang: activeLocale,
        loadMessages,
        changeLanguage,
        loadingMessages: !ready || loadingMessages,
        loadedNamespaces,
        messages: messagesDict,
      }}
    >
      {ready && (
        <IntlProvider
          locale={activeLocale}
          messages={messagesDict}
          defaultLocale={defaultLanguage}
        >
          {children}
        </IntlProvider>
      )}
    </LocaleContext.Provider>
  )
}
