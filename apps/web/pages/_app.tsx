import type { AppProps } from 'next/app'
import Head from 'next/head'

import { globalStyles } from '@island.is/island-ui/core'
import { MatomoTracker } from '@island.is/matomo'

import { getPublicRuntimeEnv } from '../environments/runtimeEnvironment'

import '@island.is/api/mocks'

globalStyles()

const IslandWebApp = ({ Component, pageProps }: AppProps) => {
  const { matomoSiteId, matomoDomain, isMatomoEnabled } = getPublicRuntimeEnv()

  return (
    <>
      <Head>
        {/* Required by the IBM Watson web chat for correct rendering on mobile devices,
            see https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-web-chat-architecture */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <MatomoTracker
        matomoDomain={matomoDomain ?? ''}
        matomoSiteId={matomoSiteId ?? ''}
        enabled={isMatomoEnabled}
      />
      <Component {...pageProps} />
    </>
  )
}

export default IslandWebApp
