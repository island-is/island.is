import App from 'next/app'
import { MatomoProvider } from '@island.is/matomo'

import { globalStyles } from '@island.is/island-ui/core'

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
