import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import { ApolloProvider } from 'react-apollo'
import { getLocaleFromPath } from '@island.is/web/i18n/withLocale'
import initApollo from './client'

export const withApollo = (Component) => {
  const NewComponent = ({ apolloState, pageProps }) => {
    const { asPath } = useRouter()
    const clientLocale = getLocaleFromPath(asPath)
    return (
      <ApolloProvider client={initApollo({ ...apolloState }, clientLocale)}>
        <Component {...pageProps} />
      </ApolloProvider>
    )
  }

  NewComponent.getInitialProps = async (ctx: NextPageContext) => {
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
