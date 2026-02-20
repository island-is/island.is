
export function redirectSystemPath({
  path,
  initial,
}: {
  path: string
  initial: boolean
  }) {
  console.log('Redirecting system path', { path, initial })

  // @todo migration - process web urls and redirect to native paths
  try {
    if (path.includes('cognito')) {
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
