import App, { type AppContext, type AppProps } from 'next/app'

import { globalStyles } from '@island.is/island-ui/core'
import { MatomoTracker } from '@island.is/matomo'

import '@island.is/api/mocks'

globalStyles()

interface IslandWebAppProps extends AppProps {
  matomoDomain: string
  matomoSiteId: string
}

function IslandWebApp({
  Component,
  pageProps,
  matomoDomain,
  matomoSiteId,
}: IslandWebAppProps) {
  return (
    <>
      <MatomoTracker matomoDomain={matomoDomain} matomoSiteId={matomoSiteId} />
      <Component {...pageProps} />
    </>
  )
}

IslandWebApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  return {
    ...appProps,
    matomoDomain: process.env.MATOMO_DOMAIN ?? '',
    matomoSiteId: process.env.MATOMO_SITE_ID ?? '',
  }
}

export default IslandWebApp
