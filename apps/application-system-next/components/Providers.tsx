'use client'

import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { LocaleProvider } from '@island.is/localization'
import { client } from '@island.is/application/graphql'
import type { Locale } from '@island.is/shared/types'

interface ProvidersProps {
  locale?: Locale
  children: React.ReactNode
}

export function Providers({ locale = 'is', children }: ProvidersProps) {
  return (
    <ApolloProvider client={client}>
      <LocaleProvider locale={locale} skipPolyfills>
        {children}
      </LocaleProvider>
    </ApolloProvider>
  )
}
