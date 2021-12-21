import React, { FC } from 'react'
import get from 'lodash/get'
import App, { AppProps } from 'next/app'
import NextCookies from 'next-cookies'
import getConfig from 'next/config'
import { ApolloProvider } from '@apollo/client'
import * as Sentry from '@sentry/node'
import { getSession, Provider } from 'next-auth/client'
import Head from 'next/head'

import {
  getActiveEnvironment,
  isRunningOnEnvironment,
} from '@island.is/shared/utils'
//import '../auth'

//import { Toast, ErrorBoundary, AppLayout, AuthProvider, AuthContext, Header } from '../components'
import { client as initApollo } from '../graphql'
//import { appWithTranslation } from '../i18n'
// import { isAuthenticated } from '../auth/utils'
//import { withHealthchecks } from '../utils/Healthchecks/withHealthchecks'
import { AuthProvider } from '../components'

import type { AuthenticateUser as User } from '@island.is/air-discount-scheme-web/lib'
import SignIn from './auth/signin'
import Index from './index'
import ClientPage from './client'
import { UserContext } from '../context'

const activeEnvironment = getActiveEnvironment()

// const {
//   publicRuntimeConfig: { SENTRY_DSN },
// } = getConfig()

// Sentry.init({
//   dsn: SENTRY_DSN,
//   environment: activeEnvironment,
//   enabled: !isRunningOnEnvironment('local'),
//   tracesSampleRate: 0.01,
// })

// interface Props {
//   isAuthenticated: boolean
//   layoutProps: any
//   user: User
//   session: any
//   apolloState: any
// }
const Layout: FC = ({children}) => {
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
      <Provider session={pageProps.session} >

        {/* <SignIn /> */}
        {/* <Index /> */}
        <Layout>
          <ClientPage />
          <AuthProvider>
            <Component {...pageProps} />

          </AuthProvider>
        </Layout>
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
  //const session = await getSession(appContext.UserContext)
  let pageProps = {}
  if(Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(customContext)) as any
  }

  const apolloState = apolloClient.cache.extract()

  return {
    pageProps,
    apolloState,
  }
}

export default SupportApplication