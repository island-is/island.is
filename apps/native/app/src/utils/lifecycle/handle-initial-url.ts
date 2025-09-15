import { Linking } from 'react-native'
import { evaluateUrl } from '../../lib/deep-linking'

/**
 * Handle the initial URL of the app.
 */
export const handleInitialUrl = async () => {
  const url = await Linking.getInitialURL()
  if (url?.includes('wallet/')) {
    return evaluateUrl(url)
  }
}
