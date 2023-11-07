import { useEffect } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'

const { publicRuntimeConfig = {} } = getConfig() ?? {}

let initialPageLoadHasOccurred = false

export const usePlausiblePageview = (domain?: string) => {
  const router = useRouter()

  useEffect(() => {
    const onRouteChangeComplete = () => {
      // Only track pageviews in production
      if (!domain) return

      console.log(window.location.href)

      // Documentation: https://plausible.io/docs/events-api
      // fetch('https://plausible.io/api/event', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'text/plain',
      //   },
      //   body: JSON.stringify({
      //     domain: domain,
      //     name: 'pageview',
      //     url: window.location.href,
      //     referrer: window.document.referrer || null,
      //   }),
      // })
    }

    // Client side routing should trigger a pageview
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Initial page load should trigger a pageview
    if (!initialPageLoadHasOccurred) {
      initialPageLoadHasOccurred = true
      onRouteChangeComplete()
    }

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [domain, router.events])
}
