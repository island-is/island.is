import { Passkey, PasskeyRegistrationResult } from 'react-native-passkey'
import {
  convertBase64UrlToBase64String,
  convertRegisterResultsToBase64Url,
  padChallenge,
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

        if (
          !options.data?.authPasskeyRegistrationOptions ||
          !options.data?.authPasskeyRegistrationOptions?.rp.id
        ) {
          return false
        }

        const { authPasskeyRegistrationOptions } = options.data

        const formattedRegistrationOptions = {
          ...options.data.authPasskeyRegistrationOptions,
          challenge: padChallenge(
            convertBase64UrlToBase64String(
              authPasskeyRegistrationOptions.challenge,
            ),
          ),
          rp: {
            id: options.data?.authPasskeyRegistrationOptions?.rp.id,
            name: authPasskeyRegistrationOptions.rp.name,
          },
          attestation: authPasskeyRegistrationOptions.attestation || undefined,
          timeout: authPasskeyRegistrationOptions.timeout || undefined,
          extensions: authPasskeyRegistrationOptions.extensions || undefined,
          authenticatorSelection:
            authPasskeyRegistrationOptions.authenticatorSelection
              ? {
                  residentKey:
                    authPasskeyRegistrationOptions.authenticatorSelection
                      .residentKey || undefined,
                  requireResidentKey:
                    authPasskeyRegistrationOptions.authenticatorSelection
                      .requireResidentKey || undefined,
                  userVerification:
                    authPasskeyRegistrationOptions.authenticatorSelection
                      .userVerification || undefined,
                }
              : undefined,
        }

        // Register Passkey on device
        const result: PasskeyRegistrationResult = await Passkey.register(
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
        console.error(
          'Passkey registration not verified',
          verifyRegisterResponse,
        )
        throw new Error('Error registering passkey')
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
        console.error('Error registering passkey', error)
        throw new Error('Register: Error registering passkey')
      }
    }
    return false
  }

  return {
    registerPasskey,
  }
}
