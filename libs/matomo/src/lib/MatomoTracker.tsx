'use client'

import { useEffect } from 'react'
import Router from 'next/router'

interface MatomoTrackerProps {
  matomoDomain: string
  matomoSiteId: string
}

/**
 * Matomo analytics tracker component.
 *
 * Initializes the Matomo command queue and tracks page views on
 * client-side route changes. The matomo.js script itself should be
 * loaded via MatomoInitScript in _document.tsx.
 *
 * Renders as a sibling (not a wrapper) to avoid hydration issues with
 * Suspense boundaries.
 *
 * Usage in _app.tsx:
 * ```tsx
 * <>
 *   <MatomoTracker matomoDomain={matomoDomain} matomoSiteId={matomoSiteId} />
 *   <Component {...pageProps} />
 * </>
 * ```
 */
export const MatomoTracker = ({
  matomoDomain,
  matomoSiteId,
}: MatomoTrackerProps) => {
  useEffect(() => {
    if (!matomoDomain || !matomoSiteId) {
      console.warn(
        '[Matomo] Tracking is not configured. Check MATOMO_DOMAIN and MATOMO_SITE_ID.',
      )
      return
    }

    const normalizedDomain = matomoDomain.endsWith('/')
      ? matomoDomain
      : `${matomoDomain}/`

    // Initialize Matomo command queue
    window._paq = window._paq || []
    window._paq.push(['setTrackerUrl', normalizedDomain + 'matomo.php'])
    window._paq.push(['setSiteId', matomoSiteId])
    window._paq.push(['enableLinkTracking'])

    // Track the initial page view
    window._paq.push(['trackPageView'])

    console.log(
      '[Matomo] Initialized, tracking initial page view:',
      Router.asPath,
    )

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
  }, [matomoDomain, matomoSiteId])

  return null
}
