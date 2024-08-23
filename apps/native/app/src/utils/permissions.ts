import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid } from 'react-native'
import { authStore } from '../stores/auth-store'
import { androidIsVersion33OrAbove } from './versions-check'

export const requestAndroidNotificationsPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  )

  return granted === PermissionsAndroid.RESULTS.GRANTED
}

export const requestNotificationsPermission = async () => {
  if (androidIsVersion33OrAbove()) {
    // Notifications modal on Android triggers the lock screen, so we need to prevent the lock screen from showing
    authStore.setState({
      noLockScreenUntilNextAppStateActive: true,
    })

    return await requestAndroidNotificationsPermission()
  }

  const authStatus = await messaging().requestPermission()

  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  )
}
