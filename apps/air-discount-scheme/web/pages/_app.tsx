import React from 'react'
import get from 'lodash/get'
import App from 'next/app'
import NextCookies from 'next-cookies'
import getConfig from 'next/config'
import { ApolloProvider } from '@apollo/client'
import * as Sentry from '@sentry/node'
import { Provider } from 'next-auth/client'

import {
  getActiveEnvironment,
  isRunningOnEnvironment,
} from '@island.is/shared/utils'
import '../auth'

import { Toast, ErrorBoundary, AppLayout } from '../components'
import { client as initApollo } from '../graphql'
import { appWithTranslation } from '../i18n'
//import { isAuthenticated } from '../auth/utils'
import { withHealthchecks } from '../utils/Healthchecks/withHealthchecks'

import { User } from './auth/interfaces'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../components'

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
}

class SupportApplication extends App<Props> {
  
  static async getInitialProps(appContext) {
    const router = useRouter()
    const { isAuthenticated, user } = useContext(AuthContext)

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
      isAuthenticated: isAuthenticated,
      user: user,
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


/*
const Index = () => {
  const { isAuthenticated, user } = useContext(AuthContext)
  const router = useRouter()
  useEffect(() => {
    document.title = 'Loftbrú þjónustusíða'
  }, [])

  const returnUrl = (user: User) => {
    return `/min-rettindi`
  }

  if (isAuthenticated && user) {
    router.push(returnUrl(user))
  }

  return null
}
export default Index */

  
    useEffect(() => {
      document.title = 'Loftbrú þjónustusíða'
    }, [])

    const returnUrl = (user: User) => {
      console.log(user)
      return `/min-rettindi`
    }

    if (isAuthenticated && user) {
      router.push(returnUrl(user))
    } else {
      return null
    }

    return (
      <Provider 
        session={pageProps.session} 
        options={{ clientMaxAge: 120, basePath: '/api/auth'}} 
      >
        <ApolloProvider client={initApollo(pageProps.apolloState)}>

          <AppLayout isAuthenticated={isAuthenticated} {...layoutProps}>
            <ErrorBoundary>
              <Component {...pageProps} />
            </ErrorBoundary>
            <Toast />
          </AppLayout>

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
