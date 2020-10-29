import './app.css'

import React from 'react'
import App from 'next/app'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import NextCookies from 'next-cookies'

import { ApolloProvider } from '@apollo/client'
import * as Sentry from '@sentry/node'
import get from 'lodash/get'

import { withHealthchecks } from '../units/Healthchecks/withHealthchecks'
import { client as initApollo } from '../graphql'
import { AppLayout } from '../components/Layouts'
import { appWithTranslation } from '../i18n'
import { isAuthenticated } from '../auth/utils'
import { LinkContext } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

const {
  publicRuntimeConfig: { SENTRY_DSN },
} = getConfig()

Sentry.init({
  dsn: SENTRY_DSN,
})

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

    const readonlyCookies = NextCookies(appContext)
    Sentry.configureScope((scope) => {
      scope.setContext('cookies', readonlyCookies)
    })

    return {
      pageProps,
      apolloState,
      isAuthenticated: isAuthenticated(appContext.ctx),
    }
  }

  getLanguage = (path) => {
    if (path.startsWith('en')) {
      return 'en'
    }
    return 'is'
  }

  render() {
    const { Component, pageProps, isAuthenticated, router } = this.props

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
      <ApolloProvider client={initApollo(pageProps.apolloState)}>
        <LinkContext.Provider
          value={{
            linkRenderer: (href, children) => (
              <a
                style={{
                  color: theme.color.blue400,
                }}
                href={href}
              >
                {children}
              </a>
            ),
          }}
        >
          <AppLayout isAuthenticated={isAuthenticated}>
            <Component {...pageProps} />
          </AppLayout>
        </LinkContext.Provider>
      </ApolloProvider>
    )
  }
}

const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint, apiUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlEndpoint, apiUrl]

export default appWithTranslation(
  withHealthchecks(externalEndpointDependencies)(SupportApplication),
)
