import React, { useState } from 'react'
import get from 'lodash/get'
import Head from 'next/head'
import App from 'next/app'
import NextCookies from 'next-cookies'
import getConfig from 'next/config'
import { ApolloProvider } from 'react-apollo'
import * as Sentry from '@sentry/node'

import { Box, ContentBlock, Footer, Page } from '@island.is/island-ui/core'

import { Toast, ErrorBoundary, Header } from '../components'
import { client } from '../graphql'
import { appWithTranslation, useI18n } from '../i18n'
import { isAuthenticated } from '../auth/utils'
import { UserContext } from '../context'

const {
  publicRuntimeConfig: { SENTRY_DSN },
} = getConfig()

Sentry.init({
  dsn: SENTRY_DSN,
})

interface LayoutPropTypes {
  children: React.ReactNode
  isAuthenticated: boolean
}

function Layout({ children, isAuthenticated }: LayoutPropTypes) {
  const { t } = useI18n()
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{ isAuthenticated, user, setUser }}>
      <Page>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="url"
            property="og:url"
            content="https://ferdagjof.island.is"
          />
          <meta name="title" property="og:title" content="Ísland.is" />
          <meta
            name="image"
            property="og:image"
            content="https://ferdagjof.island.is/og-img.png"
          />
          <meta name="image-width" property="og:image:width" content="1080" />
          <meta name="image-height" property="og:image:height" content="1203" />
          <meta
            name="description"
            property="og:description"
            content="Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt."
          />
          <title>Ísland.is</title>
        </Head>
        <Box paddingX="gutter">
          <ContentBlock>
            <Header />
          </ContentBlock>
        </Box>
        <Box paddingTop={[5, 5, 9]} paddingBottom={[7, 7, 12]}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Box>
        <Footer
          hideLanguageSwith
          topLinks={t.footer.topLinks}
          bottomLinks={t.footer.bottomLinks}
        />
        <style jsx global>{`
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 300;
            font-display: swap;
            src: local('IBM Plex Sans Light'), local('IBMPlexSans-Light'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff2')
                format('woff2'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff')
                format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: local('IBM Plex Sans'), local('IBMPlexSans'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff2')
                format('woff2'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff')
                format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: italic;
            font-weight: 400;
            font-display: swap;
            src: local('IBM Plex Sans Italic'), local('IBMPlexSans-Italic'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff2')
                format('woff2'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff')
                format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: local('IBM Plex Sans Medium'), local('IBMPlexSans-Medium'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff2')
                format('woff2'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff')
                format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: local('IBM Plex Sans SemiBold'), local('IBMPlexSans-SemiBold'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff2')
                format('woff2'),
              url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff')
                format('woff');
          }
        `}</style>
      </Page>
    </UserContext.Provider>
  )
}

interface Props {
  isAuthenticated: boolean
}

class SupportApplication extends App<Props> {
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext)

    const readonlyCookies = NextCookies(appContext)
    Sentry.configureScope((scope) => {
      scope.setContext('cookies', readonlyCookies)
    })

    return { ...appProps, isAuthenticated: isAuthenticated(appContext.ctx) }
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
      <ApolloProvider client={client}>
        <Layout isAuthenticated={isAuthenticated}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <Toast />
        </Layout>
      </ApolloProvider>
    )
  }
}

export default appWithTranslation(SupportApplication)
