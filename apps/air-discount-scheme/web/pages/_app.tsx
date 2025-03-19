import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { getSession, Provider } from 'next-auth/client'
import initApollo from '../graphql/client'
import get from 'lodash/get'
import NextCookies from 'next-cookies'
import getConfig from 'next/config'
import { Toast, ErrorBoundary, AppLayout, AuthProvider } from '../components'
import { appWithTranslation } from '../i18n'
import { isAuthenticated } from '../auth/utils'
import router from 'next/router'
import { userMonitoring } from '@island.is/user-monitoring'

const {
  publicRuntimeConfig: { ddLogsClientToken, appVersion, environment },
} = getConfig()

if (ddLogsClientToken && typeof window !== 'undefined') {
  userMonitoring.initDdLogs({
    service: 'air-discount-scheme-web',
    clientToken: ddLogsClientToken,
    env: environment,
    version: appVersion,
  })
}

const getLanguage = (path) => {
  if (path === undefined) {
    return 'is'
  }
  if (path.startsWith('en')) {
    return 'en'
  }
  return 'is'
}

const SupportApplication: any = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={initApollo(pageProps.apolloState)}>
      <Provider session={pageProps.session}>
        <AuthProvider>
          <AppLayout {...pageProps.layoutProps}>
            <ErrorBoundary>
              <Component {...pageProps.pageProps} />
            </ErrorBoundary>
            <Toast />
          </AppLayout>
        </AuthProvider>
      </Provider>
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
  let pageProps, layoutProps
  const session = await getSession()
  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(customContext)) as any
  }
  if (AppLayout.getInitialProps) {
    layoutProps = (await AppLayout.getInitialProps({
      ...customContext,
      locale: pageProps.locale,
      localeKey: pageProps.localeKey,
      routeKey: pageProps.route,
    })) as any
  }

  const readonlyCookies = NextCookies(appContext)

  const apolloState = apolloClient.cache.extract()
  return {
    pageProps: {
      layoutProps: { ...layoutProps, ...pageProps.layoutConfig },
      pageProps: pageProps,
      apolloState: apolloState,
      session: session,
      isAuthenticated: isAuthenticated(appContext.ctx),
    },
  }
}

export default appWithTranslation(SupportApplication)
