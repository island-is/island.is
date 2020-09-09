import React from 'react'
import { AppProps, AppContext, AppInitialProps } from 'next/app'
import { ApolloProvider } from 'react-apollo'
import appWithTranslation from '../i18n/appWithTranslation'
import initApollo from '../graphql/client'
import { NextComponentType } from 'next'
import { ApolloClient } from '@apollo/client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

interface AppCustomProps extends AppProps {
  apolloState?: any
}

interface AppCustomContext extends AppContext {
  apolloClient: ApolloClient<NormalizedCacheObject>
}

const SupportApplication: NextComponentType<
  AppCustomContext,
  AppInitialProps,
  AppCustomProps
> = ({ Component, apolloState, pageProps }) => {
  return (
    <ApolloProvider client={initApollo(apolloState)}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default appWithTranslation(SupportApplication)
