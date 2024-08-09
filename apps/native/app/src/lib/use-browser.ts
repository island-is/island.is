import { Passkey } from 'react-native-passkey'
import { authStore } from '../stores/auth-store'
import { useFeatureFlag } from '../contexts/feature-flag-provider'
import { preferencesStore } from '../stores/preferences-store'
import { openNativeBrowser } from './rn-island'
import { navigateTo } from './deep-linking'
import { useAuthenticatePasskey } from './passkeys/useAuthenticatePasskey'
import {
  addPasskeyAsLoginHint,
  doesUrlSupportPasskey,
} from './passkeys/helpers'

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
        authStore.setState({
          noLockScreenUntilNextAppStateActive: true,
        })
        // Open passkey flow to authenticate
        const authenticationResponse = await authenticatePasskey()
        if (authenticationResponse) {
          const urlWithLoginHint = addPasskeyAsLoginHint(
            url,
            authenticationResponse,
          )
          if (urlWithLoginHint) {
            openNativeBrowser(urlWithLoginHint, componentId)
            return
          }
        }
        // If something goes wrong we fail silently and open the browser normally
        openNativeBrowser(url, componentId)
      } else if (hasOnboardedPasskeys) {
        // Has gone through onboarding but does not have a passkey, open url without passkeys
        openNativeBrowser(url, componentId)
      } else if (!hasOnboardedPasskeys) {
        // Open passkey onboarding screen
        navigateTo('/passkey', { url, parentComponentId: componentId })
      }
    } else {
      openNativeBrowser(url, componentId)
    }
  }
  return { openBrowser }
}
