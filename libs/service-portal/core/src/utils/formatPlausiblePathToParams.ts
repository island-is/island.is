import { ParamType } from '@island.is/plausible'
import { matchPath } from 'react-router-dom'
import { ServicePortalPath } from '../lib/navigation/paths'
/**
 * Constructing the plausible tracking object.
 * Service-portal must de-construct all identifiable user data before passing info on-to plausible.
 * @param path ServicePortalPath of current page
 * @param fileName optional param for document plausible events
 * @returns ParamType: {
 * url: string,
 * location: string,
 * fileName: string
 * }
 */
export const formatPlausiblePathToParams = (
  path: string,
  fileName?: string,
) => {
  const routes = Object.values(ServicePortalPath)
  const currentPath = matchPath(path, {
    path: routes,
    exact: true,
    strict: true,
  })?.path

  const pageOrigin = window.location.origin
  const rootPath = ServicePortalPath.MinarSidurPath
  const absoluteUrl = `${pageOrigin}${rootPath}${currentPath ?? ''}`

  return {
    url: absoluteUrl,
    location: currentPath,
    ...(fileName && { fileName }),
  } as ParamType
}
