import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { useApolloClient } from '@apollo/client/react'
import gql from 'graphql-tag'
import difference from 'lodash/difference'
import isEmpty from 'lodash/isEmpty'
import { Locale } from '@island.is/shared/types'
import { defaultLanguage, supportedLocales } from '@island.is/shared/constants'

import { polyfill } from './polyfills'

export const isLocale = (value: string): value is Locale => {
  return supportedLocales.includes(value as Locale)
}

export interface MessagesDict {
  [key: string]: string
}

interface LocaleContextType {
  lang: Locale
  loadingMessages: boolean
  loadedNamespaces: string[]
  messages: MessagesDict
  loadMessages(namespaces: string | string[]): void
  changeLanguage(lang: Locale): void
}

interface LocaleProviderProps {
  locale?: Locale
  messages?: MessagesDict
  skipPolyfills?: boolean
  children: ReactNode
}

type Query = {
  getTranslations: Record<string, string>
}

export const LocaleContext = createContext<LocaleContextType>({
  lang: 'is',
  loadingMessages: true,
  loadedNamespaces: [],
  messages: {},
  loadMessages: () => undefined,
  changeLanguage: () => undefined,
})

const GET_TRANSLATIONS = gql`
  query GetTranslations($input: GetTranslationsInput!) {
    getTranslations(input: $input)
  }
`

const errorHandler = (error: Error) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    console.error(error)
  }
}

// Needs to be a constant to avoid endless state updates.
const emptyMessages = {}

export const LocaleProvider = ({
  children,
  locale = defaultLanguage,
  messages = emptyMessages,
  skipPolyfills = false,
}: LocaleProviderProps) => {
  const [ready, setReady] = useState<boolean>(skipPolyfills)
  const [activeLocale, setActiveLocale] = useState<Locale>(
    locale || defaultLanguage,
  )
  const [messagesDict, setMessagesDict] = useState<MessagesDict>(messages)
  const [loadedNamespaces, setLoadedNamespaces] = useState<string[]>([])
  const apolloClient = useApolloClient()
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false)

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
    if (locale !== activeLocale) {
      setActiveLocale(locale)
      setMessagesDict(messages)
    }
  }, [locale])

  useEffect(() => {
    if (messages) {
      setMessagesDict((old) => Object.assign({}, old, messages))
    }
  }, [messages])

  async function changeLanguage(lang: Locale) {
    setLoadingMessages(true)
    if (!skipPolyfills) {
      await polyfill(lang)
    }
    setActiveLocale(lang)

    if (loadedNamespaces.length > 0) {
      const { data } = await apolloClient.query<Query>({
        query: GET_TRANSLATIONS,
        variables: {
          input: {
            namespaces: loadedNamespaces,
            lang,
          },
        },
      })
      setMessagesDict((old) => Object.assign({}, old, data?.getTranslations))
    }

    setLoadingMessages(false)
  }

  const loadMessages = async (namespaces: string | string[]) => {
    const namespaceArr =
      typeof namespaces === 'string' ? [namespaces] : namespaces
    const diff = difference(namespaceArr, loadedNamespaces)

    // Only fetch namespaces that we have not fetched yet
    if (!isEmpty(diff)) {
      setLoadedNamespaces([...loadedNamespaces, ...diff])

      const { data } = await apolloClient.query<Query>({
        query: GET_TRANSLATIONS,
        variables: {
          input: {
            namespaces: diff,
            lang: activeLocale,
          },
        },
      })

      setLoadingMessages(false)
      setMessagesDict((old) => Object.assign({}, old, data?.getTranslations))
    }
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
          onError={errorHandler}
        >
          {children}
        </IntlProvider>
      )}
    </LocaleContext.Provider>
  )
}
