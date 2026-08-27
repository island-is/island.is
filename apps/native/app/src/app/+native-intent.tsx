import { findRoute, navigateToUniversalLink } from '@/lib/deep-linking'
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

export async function consumePendingDeepLink(
  openBrowser?: (url: string) => void | Promise<void>,
): Promise<void> {
  const raw = pendingDeepLink
  pendingDeepLink = null
  if (!raw) return

  // HTTP(S) URLs delegate to navigateToUniversalLink so we get route-match
  // for known universal links plus passkey-aware browser open for the rest.
  // Otherwise an external URL with no native route would hit
  // router.navigate(fullUrl) and either loop (Android forwards to
  // Linking.openURL) or dead-end inside the app.
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    await navigateToUniversalLink({ link: raw, openBrowser })
    return
  }

  // Custom-scheme URLs (widgets, is.island.app://...): host is the first
  // path segment (is.island.app.dev://wallet/X → /wallet/X), so prepend it.
  let path = raw
  if (raw.includes('://')) {
    try {
      const url = new URL(raw)
      const hostPrefix = url.host ? `/${url.host}` : ''
      path = `${hostPrefix}${url.pathname}${url.search}` || '/'
    } catch {
      // keep raw on parse failure
    }
  }

  const mapped = findRoute(path)
  if (mapped) {
    router.navigate(mapped as Parameters<typeof router.navigate>[0])
    return
  }
  router.navigate(path as Parameters<typeof router.navigate>[0])
}

export function clearPendingDeepLink(): void {
  pendingDeepLink = null
}

// Peek without consuming — lets unlockApp clear open modals before a replay.
export function hasPendingDeepLink(): boolean {
  return pendingDeepLink !== null
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
