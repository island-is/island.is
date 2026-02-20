'use client'

import { useEffect } from 'react'
import Router from 'next/router'

/**
 * Matomo client-side route change tracker.
 *
 * Tracks page views on Next.js client-side route changes.
 * Initial page view and Matomo configuration are handled by
 * MatomoInitScript in _document.tsx.
 *
 * Renders null (sibling, not a wrapper) to avoid hydration issues.
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
  useEffect(() => {
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

  return null
}
