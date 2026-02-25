import { useEffect, useRef, useState } from 'react'
import Router from 'next/router'
import { MatomoInitScriptProps } from './types'

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
export const MatomoTracker = ({
  matomoDomain,
  matomoSiteId,
  enabled,
}: MatomoInitScriptProps) => {
  const [isClientLoaded, setIsClientLoaded] = useState(false)
  const normalizedDomain = useRef<string>('')
  useEffect(() => {
    if (!enabled || !matomoSiteId || !matomoDomain) {
      return () => {
        // Empty on purpose
      }
    }
    normalizedDomain.current = matomoDomain.endsWith('/')
      ? matomoDomain
      : `${matomoDomain}/`
    window._paq = window._paq || []
    window._paq.push(['setTrackerUrl', `${normalizedDomain.current}matomo.php`])
    window._paq.push(['setSiteId', `${matomoSiteId}`])
    window._paq.push(['trackPageView'])
    window._paq.push(['enableLinkTracking'])
    const handleRouteChange = (url: string) => {
      window._paq?.push(['setCustomUrl', url])
      window._paq?.push(['setDocumentTitle', document.title])
      window._paq?.push(['trackPageView', window.document.title])
      window._paq?.push(['enableHeartBeatTimer', 10])
    }
    handleRouteChange(Router.asPath)
    Router.events.on('routeChangeComplete', handleRouteChange)
    setIsClientLoaded(true)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
    // This is empty on purpose - this should only happen once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!isClientLoaded) {
    return null
  }

  return (
    <script
      defer
      src={`${normalizedDomain.current}matomo.js`}
      data-id="matomoscript"
    />
  )
}
