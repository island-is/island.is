import type { AppProps } from 'next/app'

import { globalStyles } from '@island.is/island-ui/core'
import { MatomoTracker } from '@island.is/matomo'

import '@island.is/api/mocks'

globalStyles()

const IslandWebApp = ({ Component, pageProps }: AppProps) => {
  const matomoDomain = process.env.NEXT_PUBLIC_MATOMO_DOMAIN ?? ''
  const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? ''
  const isMatomoEnabled = process.env.NEXT_PUBLIC_MATOMO_ENABLED === 'true'
  return (
    <>
      <MatomoTracker
        enabled={isMatomoEnabled}
        matomoSiteId={matomoSiteId}
        matomoDomain={matomoDomain}
      />
      <Component {...pageProps} />
    </>
  )
}

export default IslandWebApp
