import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import Script from 'next/script'

import { globalStyles } from '@island.is/island-ui/core'

import '@island.is/api/mocks'

globalStyles()

const matomoDomain = process.env.NEXT_PUBLIC_MATOMO_DOMAIN
const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID
const matomoEnabled = Boolean(matomoDomain) && Boolean(matomoSiteId)
const normalizedDomain =
  matomoDomain && !matomoDomain.endsWith('/')
    ? `${matomoDomain}/`
    : matomoDomain ?? ''

function IslandWebApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!matomoEnabled) {
      console.warn(
        '[Matomo] Tracking is not configured. Check NEXT_PUBLIC_MATOMO_DOMAIN and NEXT_PUBLIC_MATOMO_SITE_ID.',
      )
      return
    }

    // Initialize Matomo command queue
    window._paq = window._paq || []
    window._paq.push(['setTrackerUrl', normalizedDomain + 'matomo.php'])
    window._paq.push(['setSiteId', matomoSiteId!])
    window._paq.push(['enableLinkTracking'])

    // Track the initial page view
    window._paq.push(['trackPageView'])

    console.log('[Matomo] Initialized, tracking initial page view:', Router.asPath)

    // Track client-side route changes
    const handleRouteChange = (url: string) => {
      console.log('[Matomo] routeChangeComplete:', url)
      window._paq?.push(['setCustomUrl', url])
      window._paq?.push(['setDocumentTitle', document.title])
      window._paq?.push(['trackPageView'])
    }

    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <>
      {matomoEnabled && (
        <Script
          src={`${normalizedDomain}matomo.js`}
          strategy="afterInteractive"
        />
      )}
      <Component {...pageProps} />
    </>
  )
}

export default IslandWebApp
