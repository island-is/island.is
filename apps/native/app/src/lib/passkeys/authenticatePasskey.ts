import { Passkey, PasskeyAuthenticationResult } from 'react-native-passkey'
import { btoa } from 'react-native-quick-base64'
import { getAuthenticationOptions, verifyAuthentication } from './server'
import { convertAuthenticationResultsToBase64Url } from './helpers'

export const authenticatePasskey = async () => {
  const isSupported: boolean = Passkey.isSupported()

  if (isSupported) {
    try {
      // Get authentication options from server
      const options = await getAuthenticationOptions()

      // Authenticate Passkey on device
      const result: PasskeyAuthenticationResult = await Passkey.authenticate({
        ...options,
        challenge: btoa(options.challenge),
      })

      // This logic is only needed because the dummy server expects base64url strings but react-native-passkey returns base64 strings
      const updatedResult = convertAuthenticationResultsToBase64Url(result)

      // Verify authentication with server
      const verifyRegisterResponse = await verifyAuthentication(updatedResult)
      if (verifyRegisterResponse.verified) {
        return true
      }
      console.error('Authentication not verified', verifyRegisterResponse)
      // TODO throw error here to show in UI?
    } catch (error: any) {
      // User cancelled the authentication flow, swallow the error
      if (error?.error === 'UserCancelled') {
        console.log('swallowing error')
        return false
      }
      console.error('Error authenticating', error)
      throw error(error)
    }
  }
}
