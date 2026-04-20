import type { AppProps } from 'next/app'
import getConfig from 'next/config'

import { globalStyles } from '@island.is/island-ui/core'
import { MatomoTracker } from '@island.is/matomo'

import '@island.is/api/mocks'

globalStyles()

const IslandWebApp = ({ Component, pageProps }: AppProps) => {
  const {
    publicRuntimeConfig: { matomoSiteId, matomoDomain, isMatomoEnabled },
  } = getConfig()

  return (
    <>
      <MatomoTracker
        matomoDomain={matomoDomain}
        matomoSiteId={matomoSiteId}
        enabled={isMatomoEnabled}
      />
      <Component {...pageProps} />
    </>
  )
}

export default IslandWebApp
