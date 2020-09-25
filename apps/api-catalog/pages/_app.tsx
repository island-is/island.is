import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

import cn from 'classnames';

import { 
  Page,
  Box,
  ContentBlock,
  Footer
} from '@island.is/island-ui/core'
import { Header } from '../components';

import * as  styles from '../styles/_app.treat';

import '../styles/global-styles.scss';
import { ApolloProvider } from 'react-apollo';
import initApollo from '../graphql/client';



const MyApp = ({ Component, pageProps }: AppProps) => {
  const client = initApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
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
          />-
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
            content="https://viskuausan.island.is"
          />
          <meta name="title" property="og:title" content="Ísland.is" />
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
        <div className={cn(styles.content)}>
          <Component {...pageProps} />
        </div>
        <div className={cn(styles.footer)}>
        <Footer 
          hideLanguageSwith
        />
        </div>
      </Page>
    </ApolloProvider>
  )
}

export default MyApp