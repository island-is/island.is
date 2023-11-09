import { useEffect } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'

const { publicRuntimeConfig = {} } = getConfig() ?? {}

let newestVisitedUrl = ''

export const usePlausiblePageview = (domain?: string) => {
  const router = useRouter()

  useEffect(() => {
    const onRouteChangeComplete = () => {
      if (
        // Only track pageviews in production
        publicRuntimeConfig.environment !== 'prod' ||
        !domain ||
        // Only track pageviews if we visit a page we weren't already on
        newestVisitedUrl === window.location.href
      ) {
        return
      }

      newestVisitedUrl = window.location.href

      // Documentation: https://plausible.io/docs/events-api
      fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          domain: domain,
          name: 'pageview',
          url: window.location.href,
          referrer: window.document.referrer || null,
        }),
      })
    }

    // Client side routing should trigger a pageview
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Initial page load should trigger a pageview
    onRouteChangeComplete()

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
      newestVisitedUrl = ''
    }
  }, [domain, router.events])
}
