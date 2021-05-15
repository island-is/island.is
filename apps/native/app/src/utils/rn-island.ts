import { Linking, NativeModules, Platform } from 'react-native'

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

  // Fallback to default openURL
  Linking.canOpenURL(url).then((canOpen) => {
    if (canOpen) {
      return Linking.openURL(url)
        .then(() => null)
        .catch(() => null)
    }
  })
}
