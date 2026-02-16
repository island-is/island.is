import App from 'next/app'

import { globalStyles } from '@island.is/island-ui/core'
import { MatomoProvider } from '@island.is/matomo'

import '@island.is/api/mocks'

globalStyles()

class IslandWebApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <MatomoProvider>
        <Component {...pageProps} />
      </MatomoProvider>
    )
  }
}

export default IslandWebApp
