import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/styles.css'
import Errorpage from './404'
function CustomApp({ Component, pageProps }: AppProps) {
  if (pageProps.pageError) {
    const { error } = pageProps.pageError
    console.log('page error:', error)
    return <Errorpage />
  }
  return (
    <>
      <Head>
        <title>Welcome to samradsgatt</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default CustomApp
