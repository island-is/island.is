import { Passkey, PasskeyCreateResult } from 'react-native-passkey'
import {
  convertRegisterResultsToBase64Url,
  formatRegisterOptions,
} from './helpers'
import {
  useGetPasskeyRegistrationOptionsLazyQuery,
  useVerifyPasskeyRegistrationMutation,
} from '../../graphql/types/schema'
import { preferencesStore } from '../../stores/preferences-store'

export const useRegisterPasskey = () => {
  const isSupported: boolean = Passkey.isSupported()

  const [getPasskeyRegistrationOptions] =
    useGetPasskeyRegistrationOptionsLazyQuery()

  const [verifyPasskeyRegistration] = useVerifyPasskeyRegistrationMutation()

  const registerPasskey = async () => {
    if (isSupported) {
      try {
        // Get registration options from server
        const options = await getPasskeyRegistrationOptions()

        const { data } = options

        if (
          !data?.authPasskeyRegistrationOptions ||
          !data?.authPasskeyRegistrationOptions?.rp.id
        ) {
          return false
        }

        const formattedRegistrationOptions = formatRegisterOptions(
          data?.authPasskeyRegistrationOptions,
        )

        // Register Passkey on device
        const result: PasskeyCreateResult = await Passkey.create(
          formattedRegistrationOptions,
        )

        // Converting needed since the server expects base64url strings but react-native-passkey returns base64 strings
        const updatedResult = convertRegisterResultsToBase64Url(result)

        // Verify registration with server
        const verifyRegisterResponse = await verifyPasskeyRegistration({
          variables: {
            input: updatedResult,
          },
        })

        if (
          verifyRegisterResponse?.data?.authPasskeyVerifyRegistration.verified
        ) {
          preferencesStore.setState({ hasCreatedPasskey: true })
          return true
        }
        throw new Error('Register: Error verifying passkey registration')
      } catch (error: any) {
        // User cancelled the register flow, swallow the error
        if (
          error?.error === 'UserCancelled' ||
          error?.message?.includes(
            'androidx.credentials.exceptions.domerrors.NotAllowedError',
          )
        ) {
          return false
        }
        throw new Error(
          'Register: Error registering passkey (' +
            (error?.message ?? 'Unknown error') +
            ')',
        )
      }
    }
    return false
  }

  return {
    registerPasskey,
  }
}
