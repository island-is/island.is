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

export function consumePendingDeepLink(): void {
  const path = pendingDeepLink
  pendingDeepLink = null
  if (!path) return
  // findRoute only covers universal-link paths (/minarsidur/...). Widgets and
  // custom-scheme URLs come through as the native route already, so fall back
  // to the raw path when there's no mapping.
  const target = findRoute(path) ?? path
  router.navigate(target as Parameters<typeof router.navigate>[0])
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
