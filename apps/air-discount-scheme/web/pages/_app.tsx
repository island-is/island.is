import React from 'react'
import get from 'lodash/get'
import App from 'next/app'
import NextCookies from 'next-cookies'
import getConfig from 'next/config'
import { ApolloProvider } from '@apollo/client'
import * as Sentry from '@sentry/node'
import { getSession, Provider, useSession } from 'next-auth/client'

import {
  getActiveEnvironment,
  isRunningOnEnvironment,
} from '@island.is/shared/utils'
//import '../auth'

import { Toast, ErrorBoundary, AppLayout, AuthProvider, AuthContext } from '../components'
import { client as initApollo } from '../graphql'
import { appWithTranslation } from '../i18n'
// import { isAuthenticated } from '../auth/utils'
import { withHealthchecks } from '../utils/Healthchecks/withHealthchecks'

import type { AuthenticateUser as User } from './api/auth/interfaces'

const activeEnvironment = getActiveEnvironment()

const {
  publicRuntimeConfig: { SENTRY_DSN },
} = getConfig()

Sentry.init({
  dsn: SENTRY_DSN,
  environment: activeEnvironment,
  enabled: !isRunningOnEnvironment('local'),
  tracesSampleRate: 0.01,
})

interface Props {
  isAuthenticated: boolean
  layoutProps: any
  user: User
  //session: any
}

class SupportApplication extends App<Props> {
  static async getInitialProps(appContext) { 
    const { Component, ctx } = appContext
    const apolloClient = initApollo({})
    const customContext = {
      ...ctx,
      apolloClient,
    }
    //console.log('all fine here')
    //let session = getSession()
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
      //session
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
      user,
    } = this.props

    // Sentry.configureScope((scope) => {
    //   scope.setExtra('lang', this.getLanguage(router.pathname))
    //   scope.setContext('router', {
    //     route: router.route,
    //     pathname: router.pathname,
    //     query: router.query,
    //     asPath: router.asPath,
    //   })
    // })

    // Sentry.addBreadcrumb({
    //   category: 'pages/_app',
    //   message: `Rendering app for Component "${get(
    //     Component,
    //     'name',
    //     'unknown',
    //   )}" (${process.browser ? 'browser' : 'server'})`,
    //   level: Sentry.Severity.Debug,
    // })


    const returnUrl = (user: User) => {
      console.log('_app returnUrl, user: ' + user)
      return `/min-rettindi`
    }

    if (isAuthenticated && user) {
      console.log('_app isAuthenticated - hello')
      router.push(returnUrl(user))
    } 
    // else {
    //   console.log('return null')
    //   return
    // }
    console.log('before return _app')
    return (
      <Provider 
        session={pageProps.session}
        options={{ clientMaxAge: 120, baseUrl: 'http://localhost:4200', basePath: '/api/auth'}} 
      >
        <ApolloProvider client={initApollo(pageProps.apolloState)}>
          <AuthProvider>
            <AppLayout isAuthenticated={isAuthenticated} {...layoutProps}>
              <ErrorBoundary>
                <Component {...pageProps} />
              </ErrorBoundary>
              <Toast />
            </AppLayout>
          </AuthProvider>
        </ApolloProvider>
      </Provider>
    )
  }
}

const { serverRuntimeConfig } = getConfig()
const { graphqlEndpoint, apiUrl } = serverRuntimeConfig
const externalEndpointDependencies = [graphqlEndpoint, apiUrl]

export default appWithTranslation(
  withHealthchecks(externalEndpointDependencies)(SupportApplication),
)
