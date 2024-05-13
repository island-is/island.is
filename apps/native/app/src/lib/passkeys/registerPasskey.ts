import { Passkey, PasskeyRegistrationResult } from 'react-native-passkey'
import { btoa } from 'react-native-quick-base64'
import { getRegistrationOptions, verifyRegister } from './server'
import { convertRegisterResultsToBase64Url } from './helpers'
import { preferencesStore } from '../../stores/preferences-store'

export const registerPasskey = async () => {
  const isSupported: boolean = Passkey.isSupported()

  if (isSupported) {
    try {
      // Get registration options from server
      const options = await getRegistrationOptions()

      // Register Passkey on device
      const result: PasskeyRegistrationResult = await Passkey.register({
        ...options,
        challenge: btoa(options.challenge),
        rp: {
          name: 'Island.is Test',
          id: 'island.is',
        },
      })

      // This logic is only needed because the dummy server expects base64url strings but react-native-passkey returns base64 strings
      const updatedResult = convertRegisterResultsToBase64Url(result)

      // Verify registration with server
      const verifyRegisterResponse = await verifyRegister(updatedResult)
      if (verifyRegisterResponse.verified) {
        preferencesStore.setState({ hasCreatedPasskey: true })
        return true
      }
      console.error('Registration not verified', verifyRegisterResponse)
      throw new Error('Registration not verified')
    } catch (error: any) {
      // User cancelled the register flow, swallow the error
      if (error?.error === 'UserCancelled') {
        return false
      }
      console.error('Error registering passkey', error)
      throw error(error)
    }
  }
  return false
}
