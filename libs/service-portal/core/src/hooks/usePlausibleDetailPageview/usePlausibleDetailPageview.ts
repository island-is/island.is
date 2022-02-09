import { useEffect } from 'react'

// Custom location helper for dynamic paths in service portal: https://plausible.io/docs/custom-locations
export const PlausiblePageviewDetail = (page: string) => {
  useEffect(() => {
    const plausible = window && window.plausible

    if (plausible) {
      plausible('pageview', { u: page })
    }
  }, [])
}

export default PlausiblePageviewDetail
