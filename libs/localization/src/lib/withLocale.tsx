import React from 'react'
import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'
import { Query, QueryGetTranslationsArgs } from '@island.is/api/schema'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

import gql from 'graphql-tag'
import { defaultLanguage, supportedLocales } from './LocaleContext'

export const GET_TRANSLATIONS = gql`
  query GetTranslations($input: GetTranslationsInput!) {
    getTranslations(input: $input)
  }
`

export const withLocale = (namespaces: string | string[] = 'global') => (
  Component,
) => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  const NewComponent: NextComponentType<any> = (props) => (
    <Component {...props} />
  )

  NewComponent.getInitialProps = async (ctx) => {
    let locale = defaultLanguage

    if (
      typeof ctx.query.lang === 'string' &&
      supportedLocales.includes(ctx.query.lang)
    ) {
      locale = ctx.query.lang
    }

    const newContext = {
      ...ctx,
      locale,
      namespaces: typeof namespaces === 'string' ? [namespaces] : namespaces,
    } as any
    const [props, messages] = await Promise.all([
      getInitialProps(newContext),
      getTranslations(newContext),
    ])

    return {
      ...props,
      locale,
      messages,
    }
  }

  return NewComponent
}

const getTranslations = ({
  apolloClient,
  locale,
  namespaces,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
  namespaces: string[]
}) => {
  console.log('Im fetching new translations..........!!!!')
  return apolloClient
    .query<Query, QueryGetTranslationsArgs>({
      query: GET_TRANSLATIONS,
      variables: {
        input: {
          namespaces,
          lang: locale,
        },
      },
    })
    .then((content) => {
      // map data here to reduce data processing in component
      return content.data?.getTranslations ?? {}
    })
}

export default withLocale
