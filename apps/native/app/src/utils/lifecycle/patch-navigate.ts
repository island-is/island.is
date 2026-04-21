import { Href, router } from 'expo-router'
import { store } from 'expo-router/build/global-state/router-store'
import { uiStore } from '../../stores/ui-store'
import { Platform } from 'react-native'

const MAIN_TABS = ['/inbox', '/wallet', '/health', '/more']

/**
 * Temporary fix for deep linking in android.
 * Bug: Clicking a link that should navigate from tab A to tab B and then push into screen C,
 * results stuck on tab B (screen C is showed momentarily before showing tab B again).
 */

if (Platform.OS === 'android') {
  // Copy the original navigate function to call it later
  const originalNavigate = router.navigate.bind(router)

  // Build paths that should trigger the tab switch logic
  const paths = ['/(auth)/(tabs)', '/(tabs)', ''].flatMap((prefix) =>
    MAIN_TABS.map((tab) => `${prefix}${tab}`),
  )

  // Override the navigate function
  router.navigate = (href) => {
    const pathname = (typeof href === 'string' ? href : href?.pathname) ?? ''
    const found = paths.find((path) => pathname.startsWith(path))
    if (found) {
      const [name] = found.split('/').reverse()
      // Wait for the tab to be focused.
      const unsub = store.navigationRef.current?.addListener('state', (e) => {
        const focusedKey = uiStore.getState().focusedTab
        const tabsRoute =
          e.data.state?.routes
            ?.find((r) => r.name === '__root')
            ?.state?.routes.find((r) => r.name === '(auth)')
            ?.state?.routes?.find((r) => r.name === '(tabs)')?.state?.routes ??
          []
        const route = tabsRoute.find((r) => r.key === focusedKey)
        if (route?.name === name) {
          unsub?.()
          originalNavigate(href)
          return
        }
      })
      return originalNavigate(found as Href)
    }

    return originalNavigate(href)
  }
}
