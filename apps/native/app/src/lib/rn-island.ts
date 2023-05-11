import {Linking, NativeModules, Platform} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {authStore} from '../stores/auth-store';

const {RNIsland} = NativeModules;

export function overrideUserInterfaceStyle(
  uiStyle: 'dark' | 'light' | 'automatic',
) {
  if (Platform.OS === 'ios') {
    return RNIsland.overrideUserInterfaceStyle(uiStyle);
  }
}

export async function openBrowser(url: string, componentId?: string) {
  if (Platform.OS === 'ios' && componentId) {
    return RNIsland.openSafari(componentId, {
      url,
      preferredBarTintColor: undefined,
      preferredControlTintColor: undefined,
      dismissButtonStyle: 'done',
    });
  }

  if (Platform.OS === 'android' && (await InAppBrowser.isAvailable())) {
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
      .then(() => null)
      .catch(() => null);
  }

  // Fallback to default openURL
  Linking.canOpenURL(url).then(canOpen => {
    if (canOpen) {
      return Linking.openURL(url)
        .then(() => null)
        .catch(() => null);
    }
  });
}
