import { useEffect } from 'react'
import { ServicePortalPath } from '@island.is/service-portal/core'

// Custom location helper for dynamic paths in service portal: https://plausible.io/docs/custom-locations
export const PlausiblePageviewDetail = (page: string) => {
  useEffect(() => {
    const plausible = window && window.plausible

    const pageOrigin = window.location.origin
    const rootPath = ServicePortalPath.MinarSidurPath
    const absoluteUrl = `${pageOrigin}${rootPath}${page}`

    if (plausible) {
      plausible('pageview', { u: absoluteUrl })
    }
  }, [])
}

export default PlausiblePageviewDetail
