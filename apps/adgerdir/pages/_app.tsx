import React, { FC } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { Header, PageLoader } from '@island.is/adgerdir/components'

import { Page, Footer, Box } from '@island.is/island-ui/core'
import appWithTranslation from '../i18n/appWithTranslation'

import initApollo from '../graphql/client'

import 'react-alice-carousel/lib/alice-carousel.css'

interface LayoutProps {
  showSearchInHeader?: boolean
  wrapContent?: boolean
  showHeader?: boolean
  showFooter?: boolean
}

const Layout: FC<LayoutProps> = ({
  showSearchInHeader = true,
  wrapContent = true,
  showHeader = true,
  showFooter = true,
  children,
}) => {
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
      <PageLoader />
      {showHeader && <Header showSearchInHeader={false} />}
      {wrapContent ? (
        <Box flexGrow={1} width="full">
          {children}
        </Box>
      ) : (
        children
      )}
      {showFooter && <Footer />}
      <style jsx global>{`
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: local('IBM Plex Sans Light'), local('IBMPlexSans-Light'),
            url('/fonts/ibm-plex-sans-v7-latin-300.woff2') format('woff2'),
            url('/fonts/ibm-plex-sans-v7-latin-300.woff') format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('IBM Plex Sans'), local('IBMPlexSans'),
            url('/fonts/ibm-plex-sans-v7-latin-regular.woff2') format('woff2'),
            url('/fonts/ibm-plex-sans-v7-latin-regular.woff') format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: italic;
          font-weight: 400;
          font-display: swap;
          src: local('IBM Plex Sans Italic'), local('IBMPlexSans-Italic'),
            url('/fonts/ibm-plex-sans-v7-latin-italic.woff2') format('woff2'),
            url('/fonts/ibm-plex-sans-v7-latin-italic.woff') format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 500;
          font-display: swap;
          src: local('IBM Plex Sans Medium'), local('IBMPlexSans-Medium'),
            url('/fonts/ibm-plex-sans-v7-latin-500.woff2') format('woff2'),
            url('/fonts/ibm-plex-sans-v7-latin-500.woff') format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: local('IBM Plex Sans SemiBold'), local('IBMPlexSans-SemiBold'),
            url('/fonts/ibm-plex-sans-v7-latin-600.woff2') format('woff2'),
            url('/fonts/ibm-plex-sans-v7-latin-600.woff') format('woff');
        }
      `}</style>
    </Page>
  )
}

const SupportApplication: FC<{
  Component: React.FC
  pageProps: AppProps['pageProps']
  apolloClient: ApolloClient<NormalizedCacheObject>
}> = ({ Component, pageProps }) => {
  const { showSearchInHeader, layoutConfig = {} } = pageProps

  return (
    <ApolloProvider client={initApollo(pageProps.apolloState)}>
      <Layout showSearchInHeader={showSearchInHeader} {...layoutConfig}>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

export default appWithTranslation(SupportApplication)
