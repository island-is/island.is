import { findRoute } from '@/lib/deep-linking'
import { Href } from 'expo-router'

// expo-router's redirectSystemPath must return a path string, but our route map
// returns Href objects like { pathname: '/inbox/[id]', params: { id } } for
// parameterized routes. Fill the bracket placeholders in before returning.
function hrefToPath(href: Href): string {
  if (typeof href === 'string') return href
  const params = (href.params ?? {}) as Record<string, string>
  return href.pathname.replace(/\[(\w+)\]/g, (_, name) => params[name] ?? '')
}

export function redirectSystemPath({
  path,
  initial,
}: {
  path: string
  initial: boolean
}): string {
  try {
    // Handle OAuth/Cognito redirects
    if (path.includes('cognito') || path.includes('oauth')) {
      return '/'
    }

    // Try to map universal link paths (island.is) to native routes
    const nativePath = findRoute(path)
    if (nativePath) {
      return hrefToPath(nativePath)
    }

    return path
  } catch {
    return '/unexpected-error'
  }
}
