import { useRouter } from 'next/router'
import { useEffect } from 'react'

let hasSentInitialPageview = false

export const usePlausiblePageview = (domain?: string) => {
  const router = useRouter()

  useEffect(() => {
    const onRouteChangeComplete = () => {
      if (!domain) return
      fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          d: domain,
          n: 'pageview',
          u: window.location.href,
          r: window.document.referrer || null,
        }),
      })
    }

    // Client side routing should trigger a pageview
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Initial page load should trigger a pageview
    if (!hasSentInitialPageview && domain) {
      onRouteChangeComplete()
      hasSentInitialPageview = true
    }

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [domain, router.events])
}
