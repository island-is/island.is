import {
  AuthorizationStatus,
  hasPermission,
  requestPermission,
} from '@react-native-firebase/messaging'
import { PermissionsAndroid } from 'react-native'
import {
  clearLockScreenSuppression,
  suppressLockScreen,
} from '../stores/auth-store'
import { preferencesStore } from '../stores/preferences-store'
import { androidIsVersion33OrAbove } from './versions-check'
import { isAndroid } from './devices'
import { app } from '../lib/firebase'

/** `blocked`: the OS will not prompt again, only system settings can change it. */
export type NotificationsPermissionOutcome = 'granted' | 'denied' | 'blocked'

/** `undetermined`: never asked, so a prompt is still possible. */
export type NotificationsPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'

type AuthorizationStatusValue =
  typeof AuthorizationStatus[keyof typeof AuthorizationStatus]

const isAuthorized = (status: AuthorizationStatusValue) =>
  status === AuthorizationStatus.AUTHORIZED ||
  status === AuthorizationStatus.PROVISIONAL

const markPermissionRequested = () =>
  preferencesStore.setState({ hasRequestedNotificationsPermission: true })

const requestAndroidNotificationsPermission =
  async (): Promise<NotificationsPermissionOutcome> => {
    markPermissionRequested()

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return 'granted'
    }

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return 'blocked'
    }

    return 'denied'
  }

export const requestNotificationsPermission = async () => {
  if (androidIsVersion33OrAbove()) {
    // Notifications modal on Android triggers the lock screen, so we need to prevent the lock screen from showing
    suppressLockScreen()
    try {
      return (await requestAndroidNotificationsPermission()) === 'granted'
    } finally {
      clearLockScreenSuppression()
    }
  }

  markPermissionRequested()

  const authStatus = await requestPermission(app.messaging())

  return isAuthorized(authStatus)
}

export const getNotificationsPermissionStatus =
  async (): Promise<NotificationsPermissionStatus> => {
    const status = await hasPermission(app.messaging())

    if (isAuthorized(status)) {
      return 'granted'
    }

    if (isAndroid) {
      // No runtime permission below Android 13, so "off" means system settings.
      if (!androidIsVersion33OrAbove()) {
        return 'denied'
      }

      // Android cannot report "not determined", so fall back to whether we asked.
      return preferencesStore.getState().hasRequestedNotificationsPermission
        ? 'denied'
        : 'undetermined'
    }

    return status === AuthorizationStatus.NOT_DETERMINED
      ? 'undetermined'
      : 'denied'
  }

/**
 * Prompts for the permission when the OS still allows it. Returns `blocked` when
 * no prompt can be shown, so the caller can point the user at system settings.
 */
export const ensureNotificationsPermission =
  async (): Promise<NotificationsPermissionOutcome> => {
    const status = await hasPermission(app.messaging())

    if (isAuthorized(status)) {
      return 'granted'
    }

    if (isAndroid) {
      // No runtime permission below Android 13, so only system settings can fix it.
      if (!androidIsVersion33OrAbove()) {
        return 'blocked'
      }

      // Notifications modal on Android triggers the lock screen, so we need to prevent the lock screen from showing
      suppressLockScreen()
      try {
        return await requestAndroidNotificationsPermission()
      } finally {
        clearLockScreenSuppression()
      }
    }

    // iOS only prompts while undetermined; once denied it never prompts again.
    if (status === AuthorizationStatus.DENIED) {
      return 'blocked'
    }

    markPermissionRequested()

    return isAuthorized(await requestPermission(app.messaging()))
      ? 'granted'
      : 'denied'
  }
