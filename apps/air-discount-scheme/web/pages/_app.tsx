import React from 'react'
import get from 'lodash/get'
import App from 'next/app'
import NextCookies from 'next-cookies'
import getConfig from 'next/config'
import { ApolloProvider } from '@apollo/client'
import * as Sentry from '@sentry/node'

import { Toast, ErrorBoundary, AppLayout } from '../components'
import { client as initApollo } from '../graphql'
import { appWithTranslation } from '../i18n'
import { isAuthenticated } from '../auth/utils'
import { withHealthchecks } from '../utils/Healthchecks/withHealthchecks'

const {
  publicRuntimeConfig: { SENTRY_DSN },
} = getConfig()

Sentry.init({
  dsn: SENTRY_DSN,
})

interface Props {
  isAuthenticated: boolean
  layoutProps: any
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
    const layoutProps = await AppLayout.getInitialProps({
      ...customContext,
      locale: pageProps.locale,
      localeKey: pageProps.localeKey,
      routeKey: pageProps.route,
    } as any)

    const readonlyCookies = NextCookies(appContext)
    Sentry.configureScope((scope) => {
      scope.setContext('cookies', readonlyCookies)
    })

    const apolloState = apolloClient.cache.extract()

    return {
      layoutProps: { ...layoutProps, ...pageProps.layoutConfig },
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
    const {
      Component,
      pageProps,
      isAuthenticated,
      router,
      layoutProps,
    } = this.props

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
        <AppLayout isAuthenticated={isAuthenticated} {...layoutProps}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <Toast />
        </AppLayout>
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
