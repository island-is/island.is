import React from 'react'
import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import { Locale, Routes } from '../types'
import { QueryGetNamespaceArgs, Query } from '@island.is/api/schema'

export const GetNamespaceQuery = gql`
  query GetNamespace($input: GetNamespaceInput!) {
    getNamespace(input: $input) {
      fields
    }
  }
`

export const withLocale = <
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {}
>(
  locale: Locale,
  route?: keyof Routes,
) => (Component: NextComponentType<C, IP, P>): NextComponentType<C, IP> => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  const NewComponent: NextComponentType<C, IP, P> = (props) => (
    <Component {...props} />
  )

  NewComponent.getInitialProps = async (ctx) => {
    const newContext = { ...ctx, locale, route } as any
    const [props] = await Promise.all([
      getInitialProps(newContext),
      getGlobalStrings(newContext),
    ])
    return {
      ...props,
      locale,
      route,
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
      query: GetNamespaceQuery,
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
