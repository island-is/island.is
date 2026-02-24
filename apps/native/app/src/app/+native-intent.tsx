
export function redirectSystemPath({
  path,
  initial,
}: {
  path: string
  initial: boolean
  }) {
  // @todo migration - process web urls and redirect to native paths
  try {
    if (path.includes('cognito') || path.includes('oauth')) {
      return '/'
    }
    if (initial) {
      return path
    }
    return path
  } catch {
    return '/unexpected-error'
  }
}
