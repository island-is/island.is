import getConfig from 'next/config'
import Head from 'next/head'
import React, { FC } from 'react'
import { ApolloProvider } from 'react-apollo'

import { appWithLocale } from '@island.is/localization'
import { withHealthchecks } from '@island.is/next/health'

import initApollo from '../graphql/client'

const Layout: FC = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Ísland.is</title>
      </Head>
      {children}
    </div>
  )
}

const SupportApplication: any = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={initApollo(pageProps.apolloState)}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

SupportApplication.getInitialProps = async (appContext) => {
  const { Component, ctx } = appContext
  const apolloClient = initApollo({})
  const customContext = {
    ...ctx,
    apolloClient,
  }
  const pageProps = (await Component.getInitialProps(customContext)) as any

  const apolloState = apolloClient.cache.extract()

  return {
    pageProps,
    apolloState,
  }
}

const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlEndpoint]

export default withHealthchecks(externalEndpointDependencies)(
  appWithLocale(SupportApplication),
)
