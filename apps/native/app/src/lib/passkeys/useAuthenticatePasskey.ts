import { Passkey, PasskeyAuthenticationResult } from 'react-native-passkey'
import { btoa } from 'react-native-quick-base64'
import { convertAuthenticationResultsToBase64Url } from './helpers'
import {
  useGetPasskeyAuthenticationOptionsLazyQuery,
  useVerifyPasskeyAuthenticationMutation,
} from '../../graphql/types/schema'

export const useAuthenticatePasskey = () => {
  const isSupported: boolean = Passkey.isSupported()

  const [getPasskeyAuthenticationOptions] =
    useGetPasskeyAuthenticationOptionsLazyQuery()

  const [verifyPasskeyAuthentication] = useVerifyPasskeyAuthenticationMutation()

  const authenticatePasskey = async () => {
    if (isSupported) {
      try {
        // Get authentication options from server
        const options = await getPasskeyAuthenticationOptions()

        if (!options.data?.authPasskeyAuthenticationOptions) {
          return false
        }

        // Authenticate Passkey on device
        const result: PasskeyAuthenticationResult = await Passkey.authenticate({
          ...options.data.authPasskeyAuthenticationOptions,
          challenge: btoa(
            options.data.authPasskeyAuthenticationOptions.challenge,
          ),
        })

        // Converting needed since the server expects base64url strings but react-native-passkey returns base64 strings
        const updatedResult = convertAuthenticationResultsToBase64Url(result)

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
        console.error('Authentication not verified', verifyAuthenticateResponse)
        throw new Error('Authentication not verified')
        // TODO throw error here to show in UI?
      } catch (error: any) {
        // User cancelled the authentication flow, swallow the error
        if (error?.error === 'UserCancelled') {
          return false
        }
        console.error('Error authenticating', error)
        throw error(error)
      }
    }
  }
  return {
    authenticatePasskey,
  }
}
