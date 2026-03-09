import { Passkey } from 'react-native-passkey'
import { suppressLockScreen } from '@/stores/auth-store'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { preferencesStore } from '@/stores/preferences-store'
import { router } from 'expo-router'
import { useAuthenticatePasskey } from '../lib/passkeys/useAuthenticatePasskey'
import {
  addPasskeyAsLoginHint,
  doesUrlSupportPasskey,
} from '../lib/passkeys/helpers'
import * as WebBrowser from 'expo-web-browser'

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
        // Don't show lockscreen behind native passkey modals
        suppressLockScreen()
        // Open passkey flow to authenticate
        const authenticationResponse = await authenticatePasskey()
        if (authenticationResponse) {
          const urlWithLoginHint = addPasskeyAsLoginHint(
            url,
            authenticationResponse,
          )
          if (urlWithLoginHint) {
            WebBrowser.openBrowserAsync(urlWithLoginHint, {
              presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
            })
            return
          }
        }
        // If something goes wrong we fail silently and open the browser normally
        WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        })
      } else if (hasOnboardedPasskeys) {
        // Has gone through onboarding but does not have a passkey, open url without passkeys
        WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        })
      } else if (!hasOnboardedPasskeys) {
        // Open passkey onboarding screen
        router.navigate({ pathname: '/passkey', params: { url, parentComponentId: componentId } })
      }
    } else {
      WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      })
    }
  }
  return { openBrowser }
}
