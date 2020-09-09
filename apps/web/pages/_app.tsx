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
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

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

  // healthchecks
  if (ctx.req?.url === '/readiness') {
    // check if we have contact with api
    const { serverRuntimeConfig } = getConfig()
    const { graphqlUrl } = serverRuntimeConfig

    // this will throw when it cant connect, we dont need to know why we cant connect here
    const { status } = await fetch(
      `${graphqlUrl}/.well-known/apollo/server-health`,
    ).catch(() => ({ status: 500 }))

    // forward the api status code as readiness status code
    ctx.res.statusCode = status
    ctx.res.end('')
    return null
  }

  if (ctx.req?.url === '/liveness') {
    ctx.res.statusCode = 200
    ctx.res.end('')
    return null
  }

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
