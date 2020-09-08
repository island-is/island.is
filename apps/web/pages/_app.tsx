import React from 'react'
import { AppProps, AppContext, AppInitialProps } from 'next/app'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from '@apollo/client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { FooterLinkProps } from '@island.is/island-ui/core'
import getConfig from 'next/config'
import { NextComponentType } from 'next'
import appWithTranslation from '../i18n/appWithTranslation'
import initApollo from '../graphql/client'
import Layout from '../layouts/main'
import { withErrorBoundary } from '../units/ErrorBoundary'
import { withHealthchecks } from '../units/Healthchecks/withHealthchecks'


interface AppCustomProps extends AppProps {
  layoutProps: {
    footerUpperMenu: FooterLinkProps[]
    footerLowerMenu: FooterLinkProps[]
    footerTagsMenu: FooterLinkProps[]
    footerMiddleMenu: FooterLinkProps[]
    namespace: Record<string, string>
  }
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
  })

  const apolloState = apolloClient.cache.extract()

  return {
    layoutProps: {
      ...layoutProps,
      ...pageProps.layoutConfig,
    },
    pageProps,
    apolloState,
  }
}

const { serverRuntimeConfig } = getConfig()
const { graphqlUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlUrl]

export default appWithTranslation(
  withHealthchecks(externalEndpointDependencies)(
    withErrorBoundary(SupportApplication),
  ),
)
