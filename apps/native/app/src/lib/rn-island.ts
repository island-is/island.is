import { Alert, Linking, NativeModules, Platform } from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { Passkey } from 'react-native-passkey'
import { authStore } from '../stores/auth-store'
import { preferencesStore } from '../stores/preferences-store'
import { navigateTo } from './deep-linking'
import { authenticatePasskey } from './passkeys/authenticatePasskey'

const { RNIsland } = NativeModules

export function overrideUserInterfaceStyle(
  uiStyle: 'dark' | 'light' | 'automatic',
) {
  if (Platform.OS === 'ios') {
    return RNIsland.overrideUserInterfaceStyle(uiStyle)
  }
}

export async function openNativeBrowser(url: string, componentId?: string) {
  if (Platform.OS === 'ios' && componentId) {
    return RNIsland.openSafari(componentId, {
      url,
      preferredBarTintColor: undefined,
      preferredControlTintColor: undefined,
      dismissButtonStyle: 'done',
    })
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

export const openBrowser = async (
  url: string,
  componentId?: string,
  passkeyEnabled?: boolean,
) => {
  const passkeysSupported: boolean = Passkey.isSupported()

  const { hasOnboardedPasskeys, hasCreatedPasskey } =
    preferencesStore.getState()

  // If url includes minar-sidur or umsoknir we need authentication so we check for passkeys
  // if (
  //   passkeysSupported && passkeyEnabled &&
  //   (url.includes('/minar-sidur') ||
  //     url.includes('/umsoknir')
  // )
  if (passkeysSupported && passkeyEnabled && url.includes('/logged-in')) {
    if (hasCreatedPasskey) {
      // Don't show lockscreen behind native passkey modals
      authStore.setState({
        noLockScreenUntilNextAppStateActive: true,
      })
      try {
        // Open passkey flow to authenticate
        const authenticated = await authenticatePasskey()
        // TODO: if authenticated is true, add login_hint to url
        if (authenticated) {
          console.log('user authenticated!')
          openNativeBrowser(url, componentId)
        }
      } catch (error) {
        // TODO - do we want to show an error here or just open the browser without login_hint?
        // Alert.alert('Villa', 'Ekki tókst að au aðgangslykil')
      }
      openNativeBrowser(url, componentId)
    } else if (hasOnboardedPasskeys) {
      // Has gone through onboarding but does not have a passkey, open url without passkeys
      openNativeBrowser(url, componentId)
    } else if (!hasOnboardedPasskeys) {
      // Open passkey onboarding screen
      navigateTo('/passkey', { url })
    }
  } else {
    openNativeBrowser(url, componentId)
  }
}
