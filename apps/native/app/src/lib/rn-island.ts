import { Linking, NativeModules } from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { authStore } from '../stores/auth-store'
import { browserIdleStore } from '../stores/browser-idle-store'
import { isAndroid, isIos } from '../utils/devices'

const { RNIsland } = NativeModules

export function overrideUserInterfaceStyle(
  uiStyle: 'dark' | 'light' | 'automatic',
) {
  if (isIos) {
    return RNIsland.overrideUserInterfaceStyle(uiStyle)
  }
}

export async function openNativeBrowser(url: string, componentId?: string) {
  // Track browser opening for idle timeout monitoring
  if (componentId) {
    browserIdleStore.getState().onBrowserOpened(componentId)
  }

  if (isIos && componentId) {
    return RNIsland.openSafari(componentId, {
      url,
      preferredBarTintColor: undefined,
      preferredControlTintColor: undefined,
      dismissButtonStyle: 'done',
    }).then((result: any) => {
      // Browser was closed by user or system
      browserIdleStore.getState().onBrowserClosed()
      return result
    })
  }

  if (isAndroid && (await InAppBrowser.isAvailable())) {
    return InAppBrowser.open(url, {
      showTitle: true,
      enableDefaultShare: true,
      forceCloseOnRedirection: true,
      headers: {
        Authorization: `Bearer ${
          authStore.getState().authorizeResult?.accessToken
        }`,
      },
    })
      .then(() => {
        // Browser was closed
        browserIdleStore.getState().onBrowserClosed()
        return null
      })
      .catch(() => {
        browserIdleStore.getState().onBrowserClosed()
        return null
      })
  }

  // Fallback to default openURL
  Linking.canOpenURL(url).then((canOpen) => {
    if (canOpen) {
      return Linking.openURL(url)
        .then(() => null)
        .catch(() => null)
    }
  })
}
