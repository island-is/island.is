import { Passkey, PasskeyGetResult } from 'react-native-passkey'

import {
  convertAuthenticationResultsToBase64Url,
  formatAuthenticationOptions,
} from './helpers'
import { useGetPasskeyAuthenticationOptionsLazyQuery } from '../../graphql/types/schema'

/**
 * Asks the person to use their passkey (Face ID, fingerprint or the phone's
 * PIN) and returns the signed answer, as the server expects it: base64 encoded
 * JSON with base64url fields. Undefined when the person cancels; throws on
 * anything else.
 */
export const useGetPasskeyAssertion = () => {
  const [getPasskeyAuthenticationOptions] =
    useGetPasskeyAuthenticationOptionsLazyQuery()

  const getPasskeyAssertion = async (): Promise<string | undefined> => {
    // A fresh challenge every time: the server accepts each only once.
    const options = await getPasskeyAuthenticationOptions({
      fetchPolicy: 'network-only',
    })

    if (!options.data?.authPasskeyAuthenticationOptions) {
      throw new Error('No passkey authentication options')
    }

    let result: PasskeyGetResult
    try {
      result = await Passkey.get(
        formatAuthenticationOptions(
          options.data.authPasskeyAuthenticationOptions,
        ),
      )
    } catch (error) {
      if (
        (error as { error?: string } | undefined)?.error === 'UserCancelled'
      ) {
        return
      }
      throw error
    }

    // Converting needed since the server expects base64url strings but react-native-passkey returns base64 strings
    return btoa(JSON.stringify(convertAuthenticationResultsToBase64Url(result)))
  }

  return { getPasskeyAssertion }
}
