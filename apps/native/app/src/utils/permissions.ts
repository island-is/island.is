import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid } from 'react-native'
import { authStore } from '../stores/auth-store'
import { androidIsVersion33OrAbove } from './versions-check'

export const requestAndroidPostNotificationsPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  )

  return granted === PermissionsAndroid.RESULTS.GRANTED
}

export const requestPostNotificationsPermission = async () => {
  if (androidIsVersion33OrAbove()) {
    // Allowing notifications toast on Android triggers the lock screen, so we need to prevent the lock screen from showing
    authStore.setState({
      noLockScreenUntilNextAppStateActive: true,
    })

    return await requestAndroidPostNotificationsPermission()
  }

  const authStatus = await messaging().requestPermission()

  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  )
}
