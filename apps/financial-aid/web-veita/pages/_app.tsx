import { globalStyles } from '@island.is/island-ui/core'
import App, { AppProps } from 'next/app'

import React from 'react'

// import '@island.is/financial-aid-web/veita/src/styles.css'

globalStyles()

class FinancialAidApplication extends App<AppProps> {
  render() {
    const { Component, pageProps } = this.props

    return <Component {...pageProps} />
  }
}

export default FinancialAidApplication
