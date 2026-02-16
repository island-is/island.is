import { AppProps } from 'next/app'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client/react'

import { Layout } from '../components/Layout'
import { initApollo } from '../graphql/client'

const CustomApp = ({ Component, pageProps }: AppProps) => {
  const apolloClient = initApollo()

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Contentful Apps - Ísland.is</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

export default CustomApp
