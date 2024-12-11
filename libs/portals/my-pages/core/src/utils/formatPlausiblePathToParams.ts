import { ParamType } from '@island.is/plausible'
import { matchPath } from 'react-router-dom'
import { ServicePortalPaths } from '../lib/navigation/paths'

/**
 * Constructing the plausible tracking object.
 * Service-portal must de-construct all identifiable user data before passing info on-to plausible.
 * @param path Url path of current page
 * @param current Current ServicePortalPath
 * @param fileName optional param for document plausible events
 * @returns ParamType: {
 * url: string,
 * location: string,
 * fileName: string
 * }
 */
export const formatPlausiblePathToParams = (
  path: string,
  overwrite?: string | string[],
  fileName?: string,
) => {
  const routes = typeof overwrite === 'string' ? [overwrite] : overwrite
  const currentPath = routes?.find((route) =>
    matchPath({ path: route, end: true }, path),
  )
  const pageOrigin = window.location.origin
  const rootPath = ServicePortalPaths.Base

  // If there are routes to be searched for by overwrite: use root as fallback.
  // If no overwrite provided: use path.
  const fallBackPath = routes ? '' : path
  const pathString = currentPath ?? fallBackPath

  const absoluteUrl = `${pageOrigin}${rootPath}${pathString}`

  return {
    url: absoluteUrl,
    location: pathString,
    ...(fileName && { fileName }),
  } as ParamType
}
