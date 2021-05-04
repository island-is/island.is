import { Linking } from 'react-native';
import { Platform, NativeModules } from 'react-native';

const { RNIsland } = NativeModules;

export function openBrowser(url: string, componentId?: string) {
  if (Platform.OS === 'ios' && componentId) {
    return RNIsland.openSafari(componentId, {
      url,
      preferredBarTintColor: undefined,
      preferredControlTintColor: undefined,
      dismissButtonStyle: 'done',
    });
  }

  // Fallback to default openURL
  Linking.canOpenURL(url).then((canOpen) => {
    if (canOpen) {
      return Linking.openURL(url)
        .then(() => null)
        .catch(() => null);
    }
  });
}
