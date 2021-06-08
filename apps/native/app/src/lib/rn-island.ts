import { Linking, NativeModules, Platform } from 'react-native'
import { CustomTabs } from 'react-native-custom-tabs'
import { authStore } from '../stores/auth-store'

const { RNIsland } = NativeModules

export function overrideUserInterfaceStyle(
  uiStyle: 'dark' | 'light' | 'automatic',
) {
  if (Platform.OS === 'ios') {
    return RNIsland.overrideUserInterfaceStyle(uiStyle)
  }
}

export function openBrowser(url: string, componentId?: string) {
  if (Platform.OS === 'ios' && componentId) {
    return RNIsland.openSafari(componentId, {
      url,
      preferredBarTintColor: undefined,
      preferredControlTintColor: undefined,
      dismissButtonStyle: 'done',
    })
  }

  if (Platform.OS === 'android') {
    return CustomTabs.openURL(url, {
      showPageTitle: true,
      enableDefaultShare: true,
      headers: {
        Authorization: `Bearer ${
          authStore.getState().authorizeResult?.accessToken
        }`,
      },
    })
      .then(() => null)
      .catch(() => null)
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
