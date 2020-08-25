import React from 'react'
import { AppProps, AppContext, AppInitialProps } from 'next/app'
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from '@apollo/client'
import { NextComponentType } from 'next'

import appWithTranslation from '../i18n/appWithTranslation'
import Layout from '../layouts/main'
import initApollo from '../graphql/client'
import { withErrorBoundary } from '../units/ErrorBoundary'

interface AppCustomProps extends AppProps {
  layoutProps: any
}

interface AppCustomContext extends AppContext {
  apolloClient: ApolloClient<NormalizedCacheObject>
}

const SupportApplication: NextComponentType<
  AppCustomContext,
  AppInitialProps,
  AppCustomProps
> = ({ Component, pageProps, layoutProps }) => {
  const { showSearchInHeader } = pageProps

  return (
    <ApolloProvider client={initApollo(pageProps.apolloState)}>
      <Layout showSearchInHeader={showSearchInHeader} {...layoutProps}>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

SupportApplication.getInitialProps = async ({ Component, ctx }) => {
  const apolloClient = initApollo({})
  const customContext = {
    ...ctx,
    apolloClient,
  }

  const pageProps = (await Component.getInitialProps(customContext)) as any
  const layoutProps = await Layout.getInitialProps({
    ...customContext,
    locale: pageProps.locale,
  } as any)

  const apolloState = apolloClient.cache.extract()

  return {
    layoutProps: { ...layoutProps, ...pageProps.layoutConfig },
    pageProps,
    apolloState,
  }
}

export default appWithTranslation(withErrorBoundary(SupportApplication))
