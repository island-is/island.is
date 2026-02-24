import { findRoute } from '@/lib/deep-linking'

export function redirectSystemPath({
  path,
  initial,
}: {
  path: string
  initial: boolean
}) {
  try {
    // Handle OAuth/Cognito redirects
    if (path.includes('cognito') || path.includes('oauth')) {
      return '/'
    }

    // Try to map universal link paths (island.is) to native routes
    const nativePath = findRoute(path)
    if (nativePath) {
      return nativePath
    }

    return path
  } catch {
    return '/unexpected-error'
  }
}
