import '../styles/App.scss'
import type { AppProps } from 'next/app'
import React from 'react'
import { Provider } from 'next-auth/client'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider
      session={pageProps.session}
      options={{
        keepAlive: parseInt(
          process.env.NEXT_PUBLIC_SESSION_KEEP_ALIVE_SECONDS || '300',
          10,
        ),
      }}
    >
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
