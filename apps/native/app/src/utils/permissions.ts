import {
  AuthorizationStatus,
  requestPermission,
} from '@react-native-firebase/messaging'
import { PermissionsAndroid } from 'react-native'
import { suppressLockScreen } from '../stores/auth-store'
import { androidIsVersion33OrAbove } from './versions-check'
import { app } from '../lib/firebase'

export const requestAndroidNotificationsPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  )

  return granted === PermissionsAndroid.RESULTS.GRANTED
}

export const requestNotificationsPermission = async () => {
  if (androidIsVersion33OrAbove()) {
    // Notifications modal on Android triggers the lock screen, so we need to prevent the lock screen from showing
    suppressLockScreen()

    return await requestAndroidNotificationsPermission()
  }

  const authStatus = await requestPermission(app.messaging())

  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  )
}
