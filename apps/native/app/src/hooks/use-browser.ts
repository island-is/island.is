import { Passkey } from 'react-native-passkey'
import { clearLockScreenSuppression, suppressLockScreen } from '@/stores/auth-store'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { preferencesStore } from '@/stores/preferences-store'
import { router } from 'expo-router'
import { useAuthenticatePasskey } from '../lib/passkeys/useAuthenticatePasskey'
import {
  addPasskeyAsLoginHint,
  doesUrlSupportPasskey,
} from '../lib/passkeys/helpers'
import * as WebBrowser from 'expo-web-browser'

const openAndSuppressBrowser = async (url: string) => {
  suppressLockScreen()
  try {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.CURRENT_CONTEXT,
    })
  } finally {
    clearLockScreenSuppression()
  }
}

export const useBrowser = () => {
  const { authenticatePasskey } = useAuthenticatePasskey()
  const isPasskeyEnabled = useFeatureFlag('isPasskeyEnabled', false)

  const openBrowser = async (url: string, componentId?: string) => {
    const passkeysSupported: boolean = Passkey.isSupported()

    const { hasOnboardedPasskeys, hasCreatedPasskey } =
      preferencesStore.getState()

    // If url includes minarsidur or umsoknir we need authentication so we check for passkeys
    if (passkeysSupported && isPasskeyEnabled && doesUrlSupportPasskey(url)) {
      if (hasCreatedPasskey) {
        // Open passkey flow to authenticate
        suppressLockScreen()
        const authenticationResponse = await authenticatePasskey()
        clearLockScreenSuppression()
        if (authenticationResponse) {
          const urlWithLoginHint = addPasskeyAsLoginHint(
            url,
            authenticationResponse,
          )
          if (urlWithLoginHint) {
            await openAndSuppressBrowser(urlWithLoginHint)
            return
          }
        }
        // If something goes wrong we fail silently and open the browser normally
        await openAndSuppressBrowser(url)
      } else if (hasOnboardedPasskeys) {
        // Has gone through onboarding but does not have a passkey, open url without passkeys
        await openAndSuppressBrowser(url)
      } else if (!hasOnboardedPasskeys) {
        // Open passkey onboarding screen
        router.navigate({ pathname: '/passkey', params: { url, parentComponentId: componentId } })
      }
    } else {
      await openAndSuppressBrowser(url)
    }
  }
  return { openBrowser }
}
