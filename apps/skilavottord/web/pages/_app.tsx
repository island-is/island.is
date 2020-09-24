import './app.css'

import React from 'react'
import App from 'next/app'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import { client as initApollo } from '../graphql'
import { AppLayout } from '../components/Layouts'
import { appWithTranslation } from '../i18n'

class SupportApplication extends App<AppProps> {
  static async getInitialProps(appContext) {
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

  render() {
    const { Component, pageProps } = this.props
    return (
      <ApolloProvider client={initApollo(pageProps.apolloState)}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ApolloProvider>
    )
  }
}

export default appWithTranslation(SupportApplication)
