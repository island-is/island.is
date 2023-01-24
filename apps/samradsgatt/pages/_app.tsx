import { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import Errorpage from './404'
import { store } from '../redux/store'
function CustomApp({ Component, pageProps }: AppProps) {
  if (pageProps.pageError) {
    const { error } = pageProps.pageError
    console.log('page error:', pageProps.pageError)
    console.log('page error:', error)
    return <Errorpage />
  }
  return (
    <Provider store={store}>
      <Head>
        <title>Welcome to samradsgatt</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </Provider>
  )
}

export default CustomApp
