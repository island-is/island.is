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
        <title>Samráðsgátt</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default CustomApp
