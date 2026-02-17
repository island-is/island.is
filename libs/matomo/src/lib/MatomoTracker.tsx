'use client'

import { useEffect, useState } from 'react'
import Router from 'next/router'
import Script from 'next/script'

/**
 * Matomo analytics tracker component.
 *
 * Renders as a sibling (not a wrapper) to avoid hydration issues with
 * Suspense boundaries. Loads matomo.js via next/script and tracks
 * initial page views + client-side route changes.
 *
 * Usage in _app.tsx:
 * ```tsx
 * <>
 *   <MatomoTracker />
 *   <Component {...pageProps} />
 * </>
 * ```
 */
export const MatomoTracker = () => {
  const [scriptSrc, setScriptSrc] = useState<string | null>(null)

  useEffect(() => {
    const matomoDomain = process.env.NEXT_PUBLIC_MATOMO_DOMAIN
    const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

    if (!matomoDomain || !matomoSiteId) {
      console.warn(
        '[Matomo] Tracking is not configured. Check NEXT_PUBLIC_MATOMO_DOMAIN and NEXT_PUBLIC_MATOMO_SITE_ID.',
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

    // Load matomo.js
    setScriptSrc(normalizedDomain + 'matomo.js')

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
  }, [])

  if (!scriptSrc) {
    return null
  }

  return <Script src={scriptSrc} strategy="afterInteractive" />
}
