import Head from 'next/head'
import React, { FC } from 'react'
import { ApolloProvider } from '@apollo/client/react'

import { LocaleProvider } from '@island.is/localization'

import initApollo from '../graphql/client'

const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Ísland.is | Greiðslur</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Greiðslur á Ísland.is" />
      </Head>
      {children}
    </div>
  )
}

const PaymentsApp: any = ({ Component, pageProps }: any) => {
  return (
    <ApolloProvider client={initApollo(pageProps.apolloState)}>
      <LocaleProvider locale={'is'}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LocaleProvider>
    </ApolloProvider>
  )
}

PaymentsApp.getInitialProps = async (appContext: any) => {
  const { Component, ctx } = appContext
  const apolloClient = initApollo({})
  const customContext = {
    ...ctx,
    apolloClient,
  }
  const pageProps = Component.getInitialProps
    ? ((await Component.getInitialProps(customContext)) as any)
    : {}

  const apolloState = apolloClient.cache.extract()

  return {
    pageProps,
    apolloState,
  }
}

export default PaymentsApp
