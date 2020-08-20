import React from 'react'
import { Locale } from './I18n'
import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'
import { QueryGetNamespaceArgs, Query } from '@island.is/api/schema'
import { GET_NAMESPACE_QUERY } from '../screens/queries'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

export const withLocale = <
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {}
>(
  locale: Locale,
) => (Component: NextComponentType<C, IP, P>): NextComponentType<C, IP> => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  const NewComponent: NextComponentType<C, IP, P> = (props) => (
    <Component {...props} />
  )

  NewComponent.getInitialProps = async (ctx) => {
    console.log('running locale query', ctx.apolloClient)
    const newContext = { ...ctx, locale } as any
    const [props, translations] = await Promise.all([
      getInitialProps(newContext),
      getGlobalStrings(newContext),
    ])
    return {
      ...props,
      locale,
      translations,
    }
  }
  return NewComponent
}

const getGlobalStrings = ({
  apolloClient,
  locale,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: Locale
}) => {
  return apolloClient
    .query<Query, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'Global',
          lang: locale,
        },
      },
    })
    .then((content) => {
      // map data here to reduce data processing in component
      return JSON.parse(content.data.getNamespace.fields)
    })
}

export default withLocale
