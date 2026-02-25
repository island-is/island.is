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
    const el = document.querySelector(
      'script[data-id="matomoscript"]',
    ) as HTMLScriptElement | null
    if (!el) {
      return () => {
        // Empty on purpose
      }
    }
    const handleRouteChange = (url: string) => {
      window._paq?.push(['setCustomUrl', url])
      window._paq?.push(['setDocumentTitle', document.title])
      window._paq?.push(['trackPageView'])
    }

    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
    // This is empty on purpose - this should only happen once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
