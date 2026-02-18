import type { AppProps } from 'next/app'

import { globalStyles } from '@island.is/island-ui/core'
import { MatomoTracker } from '@island.is/matomo'

import '@island.is/api/mocks'

globalStyles()

function IslandWebApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MatomoTracker />
      <Component {...pageProps} />
    </>
  )
}

export default IslandWebApp
