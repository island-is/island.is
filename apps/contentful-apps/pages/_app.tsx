import { AppProps } from 'next/app'
import Head from 'next/head'

import { Layout } from '../components/Layout'

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Contentful Apps - Ísland.is</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default CustomApp
