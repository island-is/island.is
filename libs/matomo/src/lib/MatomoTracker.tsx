import { useEffect, useRef, useState } from 'react'
import Router from 'next/router'
import Script from "next/script"
import { MatomoInitScriptProps } from './types'

/**
 * Matomo client-side tracker and route change handler.
 *
 * Initializes Matomo tracking and tracks page views on Next.js
 * client-side route changes. Renders a script tag to load matomo.js
 * after client hydration.
 *
 * Usage in _app.tsx:
 * ```tsx
 * <>
 *   <MatomoTracker
 *     matomoDomain={domain}
 *     matomoSiteId={siteId}
 *     enabled={isEnabled}
 *   />
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
    console.log({
      normalizedDomain,
      isClientLoaded,
      enabled,
      matomoSiteId,
      matomoDomain,
    })
    window._paq = window._paq || []
    window._paq.push(['setTrackerUrl', `${normalizedDomain.current}matomo.php`])
    window._paq.push(['setSiteId', `${matomoSiteId}`])
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
    <Script
      id="matomo-script"
      async
      src={`${normalizedDomain.current}matomo.js`}
      strategy="afterInteractive"
      onLoad={() => console.log("Matomo loaded:", `${normalizedDomain}matomo.js`)}
      onError={(e) => console.error("Matomo failed to load:", e)}
      data-id="matomo-script"
    />
  )
}
