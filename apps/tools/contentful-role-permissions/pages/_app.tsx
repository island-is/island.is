import { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from '@island.is/island-ui/core'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Contentful role permissions</title>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
      <ToastContainer />
    </>
  )
}

export default CustomApp
