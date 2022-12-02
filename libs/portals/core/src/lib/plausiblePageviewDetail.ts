// Custom location helper for dynamic paths in service portal: https://plausible.io/docs/custom-locations
export const plausiblePageviewDetail = ({
  path,
  basePath,
}: {
  basePath: string
  path: string | string[]
}) => {
  const plausible = window && window.plausible
  const pagePath = typeof path === 'string' ? path : path[0]
  const pageOrigin = window.location.origin
  const absoluteUrl = `${pageOrigin}${basePath}${pagePath}`

  if (plausible) {
    plausible('pageview', { u: absoluteUrl })
  }
}
