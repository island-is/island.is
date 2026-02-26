import { addEventListener } from '@react-native-community/netinfo'
import {
  DeviceEventEmitter,
  Linking
} from 'react-native'
import { evaluateUrl } from '../../lib/deep-linking'
import { environmentStore } from '../../stores/environment-store'
import { offlineStore } from '../../stores/offline-store'
import { handleQuickAction } from '../quick-actions'
import * as WebBrowser from 'expo-web-browser'

export function setupEventHandlers() {
  // Listen for url events through iOS and Android's Linking library
  Linking.addEventListener('url', ({ url }) => {
    console.log('Received url event:', url);
    if (url.includes('wallet/')) {
      return evaluateUrl(url)
    }

    // Handle Cognito
    if (/cognito/.test(url)) {
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
      WebBrowser.dismissBrowser();
    }
  })

  // Handle quick actions
  DeviceEventEmitter.addListener('quickActionShortcut', handleQuickAction)

  // Subscribe to network status changes
  addEventListener(({ isConnected }) => {
    const offlineStoreState = offlineStore.getState()

    if (!isConnected) {
      offlineStoreState.actions.setNetInfoNoConnection()
    } else {
      offlineStoreState.actions.setIsConnected(true)

      if (!offlineStoreState.pastIsConnected) {
        offlineStoreState.actions.resetConnectionState()
      }
    }
  })
}
