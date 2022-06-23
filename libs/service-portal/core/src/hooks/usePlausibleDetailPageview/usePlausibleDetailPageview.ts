import { ServicePortalPath } from '@island.is/service-portal/core'

// Custom location helper for dynamic paths in service portal: https://plausible.io/docs/custom-locations
export const PlausiblePageviewDetail = (
  page: ServicePortalPath | ServicePortalPath[],
) => {
  const plausible = window && window.plausible
  const pagePath = typeof page === 'string' ? page : page[0]

  const pageOrigin = window.location.origin
  const rootPath = ServicePortalPath.MinarSidurPath
  const absoluteUrl = `${pageOrigin}${rootPath}${pagePath}`

  if (plausible) {
    plausible('pageview', { u: absoluteUrl })
  }
}

export default PlausiblePageviewDetail
