import { Passkey, PasskeyGetResult } from 'react-native-passkey'
import { btoa } from 'react-native-quick-base64'
import {
  convertAuthenticationResultsToBase64Url,
  formatAuthenticationOptions,
} from './helpers'
import { useGetPasskeyAuthenticationOptionsLazyQuery } from '../../graphql/types/schema'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'

const ONE_HOUR = 60 * 60 * 1000

export const useAuthenticatePasskey = () => {
  const isSupported: boolean = Passkey.isSupported()
  const { lastUsedPasskey } = usePreferencesStore()

  const [getPasskeyAuthenticationOptions] =
    useGetPasskeyAuthenticationOptionsLazyQuery()

  const authenticatePasskey = async () => {
    // Ids session should be valid for one hour, so we only need to authenticate once per hour
    if (isSupported && new Date().getTime() - lastUsedPasskey > ONE_HOUR) {
      try {
        // Get authentication options from server
        const options = await getPasskeyAuthenticationOptions()

        if (!options.data?.authPasskeyAuthenticationOptions) {
          return
        }

        const formattedAuthenticateOptions = formatAuthenticationOptions(
          options.data?.authPasskeyAuthenticationOptions,
        )

        // Authenticate Passkey on device
        const result: PasskeyGetResult = await Passkey.get(
          formattedAuthenticateOptions,
        )

        // Converting needed since the server expects base64url strings but react-native-passkey returns base64 strings
        const updatedResult = convertAuthenticationResultsToBase64Url(result)

        preferencesStore.setState({ lastUsedPasskey: new Date().getTime() })

        // TODO: Remove from updatedResult stuff we don't need to make url smaller
        const passkey = btoa(JSON.stringify(updatedResult))

        return passkey
      } catch (error: any) {
        // User cancelled the authentication flow, swallow the error
        if (error?.error === 'UserCancelled') {
          return
        }
        console.error('Error authenticating with passkey', error)
      }
    }
  }
  return {
    authenticatePasskey,
  }
}
