import { findRoute } from '@/lib/deep-linking'
import { Href, router } from 'expo-router'
import { isLockScreenActive } from '@/stores/auth-store'

// redirectSystemPath returns a string; our route map returns Href objects.
// Fill bracket placeholders in before returning.
function hrefToPath(href: Href): string {
  if (typeof href === 'string') return href
  const params = (href.params ?? {}) as Record<string, string>
  return href.pathname.replace(/\[(\w+)\]/g, (_, name) => params[name] ?? '')
}

// Deep-link URL deferred while the lock screen is up. Returning '' from
// redirectSystemPath drops the navigation; unlockApp() replays it.
let pendingDeepLink: string | null = null

// Stash a URL to replay after unlock. Used by non-redirectSystemPath entry
// points (notifications, useLinkingURL) so all locked deep-link sources funnel
// through the same pending queue.
export function stashPendingDeepLink(url: string): void {
  pendingDeepLink = url
}

export function consumePendingDeepLink(): void {
  const path = pendingDeepLink
  pendingDeepLink = null
  if (!path) return
  // findRoute only covers universal-link paths (/minarsidur/...). Widgets and
  // custom-scheme URLs come through as the native route already.
  const mapped = findRoute(path)
  if (mapped) {
    router.navigate(mapped as Parameters<typeof router.navigate>[0])
    return
  }
  // Strip the scheme before navigating — passing a full URL to router.navigate
  // forwards to Linking.openURL on Android, which re-delivers the intent and
  // loops endlessly. For custom-scheme URLs the "host" is actually the first
  // path segment (e.g. is.island.app.dev://wallet/X → /wallet/X), so prepend it.
  let pathname = path
  if (path.includes('://')) {
    try {
      const url = new URL(path)
      const host = url.host ? `/${url.host}` : ''
      pathname = `${host}${url.pathname}${url.search}` || '/'
    } catch {
      // keep raw path on parse failure
    }
  }
  router.navigate(pathname as Parameters<typeof router.navigate>[0])
}

export function clearPendingDeepLink(): void {
  pendingDeepLink = null
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

    // Runtime deep-link while locked: stash + skip nav (replays on unlock).
    if (!initial && isLockScreenActive()) {
      pendingDeepLink = path
      return ''
    }

    const nativePath = findRoute(path)
    if (nativePath) {
      return hrefToPath(nativePath)
    }

    return path
  } catch {
    return '/unexpected-error'
  }
}
