import React, { createContext, useState, useEffect } from 'react'
import { IntlProvider } from 'react-intl'
import { useLazyQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { difference, isEmpty, uniq } from 'lodash'
import { parseMessageId } from './parseMessageId'
import { polyfill } from './polyfills'

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
  const [ready, setReady] = useState<Boolean>(false)
  const [activeLocale, setActiveLocale] = useState<Locale>(
    locale || defaultLanguage,
  )
  const [messagesDict, setMessagesDict] = useState<MessagesDict>(messages)
  const [loadedNamespaces, setLoadedNamespaces] = useState<String[]>([])

  const [fetchMessages, { loading: loadingMessages, data }] = useLazyQuery(
    GET_TRANSLATIONS,
  )

  useEffect(() => {
    async function prepare() {
      await polyfill(locale)
      setReady(true)
    }

    prepare()
  }, [])

  useEffect(() => {
    extractNamespaces(messagesDict)
  }, [messagesDict])

  useEffect(() => {
    accumulateMessages(locale, messages, data?.getTranslations ?? {})
  }, [locale, messages, data])

  const loadMessages = async (namespaces: string | string[], lang: Locale) => {
    const namespaceArr =
      typeof namespaces === 'string' ? [namespaces] : namespaces
    const diff = difference(namespaceArr, loadedNamespaces)

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

  async function accumulateMessages(
    locale: Locale,
    messages: MessagesDict,
    messagesFromQuery: any,
  ) {
    if (locale !== activeLocale) {
      // locele changed, reset messages
      await polyfill(locale)
      setActiveLocale(locale)
      setMessagesDict(messages)
    } else {
      setMessagesDict(
        Object.assign({}, messagesDict, messages, messagesFromQuery),
      )
    }
  }

  return (
    <LocaleContext.Provider
      value={{
        lang: activeLocale,
        loadMessages,
        loadingMessages: !ready || loadingMessages,
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
