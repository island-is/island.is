import { useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'
import { usePreferencesStore } from '../new-stores/preferences-store'
import { requestAndroidNotificationsPermission } from '../utils/permissions'
import { androidIsVersion33OrAbove } from '../utils/versions-check'
import { isAndroid } from '../utils/devices'

/**
 * Android >= 13 (API level >= 33) requires explicit permission for posting notifications.
 * This hook is for already onboarded users that have enabled notifications and are using Android 13 or above.
 * It then requests the permission if it hasn't been granted yet.
 */
export const useAndroidNotificationPermission = (
  documentNotifications?: boolean,
) => {
  const hasOnboardedNotifications = usePreferencesStore(
    ({ hasOnboardedNotifications }) => hasOnboardedNotifications,
  )

  useEffect(() => {
    // Only run on Android devices
    if (!isAndroid) {
      return
    }

    // We need to check if the user has already enabled notifications and has onboarded the notifications screen
    // and if the user is using Android 13 (API level 33) or above.
    if (
      documentNotifications &&
      hasOnboardedNotifications &&
      androidIsVersion33OrAbove()
    ) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ).then((granted) => {
        if (!granted) {
          requestAndroidNotificationsPermission()
        }
      })
    }
  }, [documentNotifications, hasOnboardedNotifications])
}
