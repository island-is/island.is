import { AppProps } from 'next/app'
import Head from 'next/head'
import Errorpage from './404'

function CustomApp({ Component, pageProps }: AppProps) {
  if (pageProps.pageError) {
    const { error } = pageProps.pageError
    console.log('page error:', pageProps.pageError)
    console.log('page error:', error)
    return <Errorpage />
  }
  return (
    <>
      <Head>
        <title>Welcome to samradsgatt</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default CustomApp
