import { Passkey, PasskeyAuthenticationResult } from 'react-native-passkey'
import {
  convertAuthenticationResultsToBase64Url,
  convertBase64UrlToBase64String,
  padChallenge,
} from './helpers'
import {
  useGetPasskeyAuthenticationOptionsLazyQuery,
  useVerifyPasskeyAuthenticationMutation,
} from '../../graphql/types/schema'
import { preferencesStore } from '../../stores/preferences-store'

const ONE_HOUR = 3600000

export const useAuthenticatePasskey = () => {
  const isSupported: boolean = Passkey.isSupported()
  const { lastUsedPasskey } = preferencesStore.getState()

  const [getPasskeyAuthenticationOptions] =
    useGetPasskeyAuthenticationOptionsLazyQuery()

  const [verifyPasskeyAuthentication] = useVerifyPasskeyAuthenticationMutation()

  const authenticatePasskey = async () => {
    // Ids session should be valid for one hour, so we only need to authenticate once per hour
    if (isSupported && new Date().getTime() - lastUsedPasskey > ONE_HOUR) {
      try {
        // Get authentication options from server
        const options = await getPasskeyAuthenticationOptions()

        if (!options.data?.authPasskeyAuthenticationOptions) {
          return false
        }

        // Authenticate Passkey on device
        const result: PasskeyAuthenticationResult = await Passkey.authenticate({
          ...options.data.authPasskeyAuthenticationOptions,
          challenge: padChallenge(
            convertBase64UrlToBase64String(
              options.data.authPasskeyAuthenticationOptions.challenge,
            ),
          ),
        })

        // Converting needed since the server expects base64url strings but react-native-passkey returns base64 strings
        const updatedResult = convertAuthenticationResultsToBase64Url(result)

        preferencesStore.setState({ lastUsedPasskey: new Date().getTime() })

        // Verify authentication with server
        const verifyAuthenticateResponse = await verifyPasskeyAuthentication({
          variables: {
            input: { ...updatedResult, clientExtensionResults: {} },
          },
        })

        if (
          verifyAuthenticateResponse?.data?.authPasskeyVerifyAuthentication
            .verified
        ) {
          return true
        }
        console.error(
          'Passkey authentication not verified',
          verifyAuthenticateResponse,
        )
      } catch (error: any) {
        // User cancelled the authentication flow, swallow the error
        if (error?.error === 'UserCancelled') {
          return false
        }
        console.error('Error authenticating with passkey', error)
      }
    }
  }
  return {
    authenticatePasskey,
  }
}
