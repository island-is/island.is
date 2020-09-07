import type { AppProps } from 'next/app'
import React from 'react'

import '../styles/global-styles.scss'
 
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp