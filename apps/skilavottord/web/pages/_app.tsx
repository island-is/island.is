import '@island.is/api/mocks'
import './app.css'

import React from 'react'
import App from 'next/app'
import { AppProps } from 'next/app'
import getConfig from 'next/config'
import { SessionProvider } from 'next-auth/react'

import { ApolloProvider } from '@apollo/client'
import get from 'lodash/get'

import { client as initApollo } from '../graphql'
import { AppLayout } from '../components/Layouts'
import { appWithTranslation } from '../i18n'
import { userMonitoring } from '@island.is/user-monitoring'

const {
  publicRuntimeConfig: { ddLogsClientToken, appVersion, environment },
} = getConfig()

if (ddLogsClientToken && typeof window !== 'undefined') {
  userMonitoring.initDdLogs({
    service: 'skilavottord',
    clientToken: ddLogsClientToken,
    env: environment,
    version: appVersion,
  })
}

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
    const { Component, pageProps } = this.props

    return (
      <SessionProvider
        session={pageProps.session}
        basePath="/app/skilavottord/api/auth"
        refetchInterval={120}
      >
        <ApolloProvider client={initApollo(pageProps.apolloState)}>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </ApolloProvider>
      </SessionProvider>
    )
  }
}

export default appWithTranslation(Skilavottord)
