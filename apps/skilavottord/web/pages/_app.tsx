import '@island.is/api/mocks'
import './app.css'

import React from 'react'
import App from 'next/app'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import { Provider } from 'next-auth/client'

import { ApolloProvider } from '@apollo/client'
import * as Sentry from '@sentry/node'
import get from 'lodash/get'
import { withHealthchecks } from '@island.is/next/health'

import { client as initApollo } from '../graphql'
import { AppLayout } from '../components/Layouts'
import { appWithTranslation } from '../i18n'

const {
  publicRuntimeConfig: { SENTRY_DSN },
} = getConfig()

Sentry.init({
  dsn: SENTRY_DSN,
})

class Skilavottord extends App<AppProps> {
  static async getInitialProps(appContext: any) {
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

  getLanguage = (path: string) => {
    if (path.startsWith('en')) {
      return 'en'
    }
    return 'is'
  }

  render() {
    const { Component, pageProps, router } = this.props

    Sentry.configureScope((scope) => {
      scope.setExtra('lang', this.getLanguage(router.pathname))
      scope.setContext('router', {
        route: router.route,
        pathname: router.pathname,
        query: router.query,
        asPath: router.asPath,
      })
    })

    Sentry.addBreadcrumb({
      category: 'pages/_app',
      message: `Rendering app for Component "${get(
        Component,
        'name',
        'unknown',
      )}" (${process.browser ? 'browser' : 'server'})`,
      level: Sentry.Severity.Debug,
    })

    return (
      <Provider
        session={pageProps.session}
        options={{ clientMaxAge: 120, basePath: '/app/skilavottord/api/auth' }}
      >
        <ApolloProvider client={initApollo(pageProps.apolloState)}>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </ApolloProvider>
      </Provider>
    )
  }
}

const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint } = serverRuntimeConfig

export default appWithTranslation(
  withHealthchecks([graphqlEndpoint])(Skilavottord),
)
