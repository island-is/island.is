import { Linking } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { environmentStore } from '../../stores/environment-store'
import { evaluateUrl } from '../../lib/deep-linking'

/**
 * Handle the initial URL of the app.
 */
export const handleInitialUrl = async () => {
  const url = await Linking.getInitialURL()
  if (url?.includes('wallet/')) {
    return evaluateUrl(url)
  }

  // Handle Cognito redirect when delivered as the initial URL on Android
  if (url && /cognito/.test(url)) {
    const [, hash] = url.split('#')
    const params = String(hash)
      .split('&')
      .reduce((acc, param) => {
        const [key, value] = param.split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)

    environmentStore.getState().actions.setCognito({
      idToken: params.id_token,
      accessToken: params.access_token,
      expiresIn: Number(params.expires_in),
      expiresAt: Number(params.expires_in) + Date.now() / 1000,
      tokenType: params.token_type,
    })

    // Ensure any modals used for auth are closed
    Navigation.dismissAllModals()
  }
}
