import { matchPath } from 'react-router-dom'
import { ParamType } from '@island.is/plausible'

interface FormatPlausiblePathToParams {
  path: string
  routes: string[]
  basePath: string
  fileName?: string
}

export type UserEntity = 'company' | 'person'

/**
 * Constructing the plausible tracking object.
 * Portals must de-construct all identifiable user data before passing info on-to plausible.
 *
 * @param path ServicePortalPath of current page
 * @param fileName optional param for document plausible events
 */
export const formatPlausiblePathToParams = ({
  path,
  routes,
  basePath,
  fileName,
}: FormatPlausiblePathToParams): ParamType => {
  const currentPath = routes.find((route) =>
    matchPath({ path: route, end: true }, path),
  )
  const pageOrigin = window.location.origin
  const absoluteUrl = `${pageOrigin}${basePath}${currentPath ?? ''}`

  return {
    url: absoluteUrl,
    location: currentPath,
    ...(fileName && { fileName }),
  }
}

// Custom location helper for dynamic paths in service portal: https://plausible.io/docs/custom-locations
export const plausiblePageviewDetail = ({
  path,
  basePath,
  entity,
}: {
  basePath: string
  path: string
  entity: UserEntity
}) => {
  const plausible = window && window.plausible
  const pagePath = path
  const pageOrigin = window.location.origin
  const absoluteUrl = `${pageOrigin}${basePath}${pagePath}`

  if (plausible) {
    plausible('pageview', { u: absoluteUrl, props: { entity } })
  }
}
