import { AppProps } from 'next/app'
import Head from 'next/head'
import { Layout } from '../components/Layout'

// @contentful/field-editor-rich-text package checks the navigator.userAgent property so we need to mock it on the server to not get a runtime error
if (typeof global.navigator === 'undefined') {
  // @ts-ignore next-line
  global.navigator = {}
}

function CustomApp({ Component, pageProps }: AppProps) {
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
