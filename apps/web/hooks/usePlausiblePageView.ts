import { useEffect } from 'react'

export const usePlausiblePageview = (domain?: string) => {
  useEffect(() => {
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
  }, [domain])
}
