import React, { FC } from 'react'
import Head from 'next/head'
import { ApolloProvider } from 'react-apollo'

import initApollo from '../graphql/client'
import { appWithLocale } from '@island.is/localization'

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

export default appWithLocale(SupportApplication)
