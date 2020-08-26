import React from 'react'
import { AppProps, AppContext, AppInitialProps } from 'next/app'
import { ApolloProvider } from 'react-apollo'
import appWithTranslation from '../i18n/appWithTranslation'
import initApollo from '../graphql/client'
import Layout from '../layouts/main'
import { NextComponentType } from 'next'
import { withErrorBoundary } from '../units/ErrorBoundary'
import { ApolloClient } from '@apollo/client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

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
