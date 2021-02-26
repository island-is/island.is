import React, { ComponentClass } from 'react'
import { useRouter } from 'next/router'
import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'
import { ApolloProvider } from '@apollo/client/react'
import { getLocaleFromPath } from '@island.is/web/i18n/withLocale'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import initApollo from './client'

export const withApollo = <
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {}
>(
  Component: NextComponentType<C, IP, P>,
) => {
  const NewComponent = ({
    apolloState,
    pageProps,
  }: {
    apolloState: NormalizedCacheObject
    pageProps: P
  }) => {
    const { asPath } = useRouter()
    const clientLocale = getLocaleFromPath(asPath)

    return (
      <ApolloProvider client={initApollo({ ...apolloState }, clientLocale)}>
        <Component {...pageProps} />
      </ApolloProvider>
    )
  }

  NewComponent.getInitialProps = async (ctx: C) => {
    const clientLocale = getLocaleFromPath(ctx.asPath)
    const apolloClient = initApollo({}, clientLocale)
    const newContext = { ...ctx, apolloClient }
    const props = Component.getInitialProps
      ? await Component.getInitialProps(newContext)
      : {}
    const cache = apolloClient.cache.extract()
    return {
      pageProps: props,
      apolloState: cache,
    }
  }

  return NewComponent
}

export default withApollo
