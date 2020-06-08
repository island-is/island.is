import React, { useContext } from 'react'
import Head from 'next/head'
import App from 'next/app'
import Link from 'next/link'
import Router from 'next/router'
import { ApolloProvider } from 'react-apollo'

import {
  Box,
  ContentBlock,
  Footer,
  Header,
  Page,
} from '@island.is/island-ui/core'

import { Toast } from '../components'
import { client } from '../graphql'
import appWithTranslation from '../i18n/appWithTranslation'
import { isAuthenticated } from '../auth/utils'
import { UserContext } from '../context/UserContext'
import { api } from '../services'

const Layout: React.FC = ({ children }) => {
  const user = useContext(UserContext)
  return (
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
          name="description"
          content="Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt."
        />
        <title>Ísland.is</title>
      </Head>
      <Box paddingX="gutter">
        <ContentBlock>
          <Header
            logoRender={(logo) => (
              <Link href="/">
                <a>{logo}</a>
              </Link>
            )}
            authenticated={user.isAuthenticated}
            onLogout={() => {
              const redirect = /fyrirtaeki/i.test(Router.pathname)
                ? '/fyrirtaeki'
                : '/'
              console.log(Router.pathname)
              api.logout().then(() => Router.push(redirect))
            }}
          />
        </ContentBlock>
      </Box>
      <Box paddingTop={[5, 5, 9]} paddingBottom={[7, 7, 12]}>
        {children}
      </Box>
      <Footer />
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
  )
}

interface Props {
  isAuthenticated: boolean
}

class SupportApplication extends App<Props> {
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext)
    return { ...appProps, isAuthenticated: isAuthenticated(appContext.ctx) }
  }
  render() {
    const { Component, pageProps, isAuthenticated } = this.props
    return (
      <UserContext.Provider value={{ isAuthenticated }}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
            <Toast />
          </Layout>
        </ApolloProvider>
      </UserContext.Provider>
    )
  }
}

export default appWithTranslation(SupportApplication)
