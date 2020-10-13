import './app.css'

import React from 'react'
import App from 'next/app'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import getConfig from 'next/config'
import { withHealthchecks } from '../units/Healthchecks/withHealthchecks'
import { client as initApollo } from '../graphql'
import { AppLayout } from '../components/Layouts'
import { appWithTranslation } from '../i18n'
import { isAuthenticated } from '../auth/utils'

interface Props extends AppProps {
  isAuthenticated: boolean
}

class SupportApplication extends App<Props> {
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
      isAuthenticated: isAuthenticated(appContext.ctx),
    }
  }

  render() {
    const { Component, pageProps, isAuthenticated } = this.props
    return (
      <ApolloProvider client={initApollo(pageProps.apolloState)}>
        <AppLayout isAuthenticated={isAuthenticated}>
          <Component {...pageProps} />
        </AppLayout>
      </ApolloProvider>
    )
  }
}

// TODO: Add api endpoint? Other external dependencies?
const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint, apiUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlEndpoint, apiUrl]

export default appWithTranslation(
  withHealthchecks(externalEndpointDependencies)(SupportApplication),
)
