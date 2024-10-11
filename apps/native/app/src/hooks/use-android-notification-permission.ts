import { useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'
import { useGetProfileQuery } from '../graphql/types/schema'
import { usePreferencesStore } from '../stores/preferences-store'
import { requestAndroidNotificationsPermission } from '../utils/permissions'
import { androidIsVersion33OrAbove } from '../utils/versions-check'

/**
 * Android >= 13 (API level >= 33) requires explicit permission for posting notifications.
 * This hook is for already onboarded users that have enabled notifications and are using Android 13 or above.
 * It then requests the permission if it hasn't been granted yet.
 */
export const useAndroidNotificationPermission = () => {
  const userProfile = useGetProfileQuery()
  const hasOnboardedNotifications = usePreferencesStore(
    ({ hasOnboardedNotifications }) => hasOnboardedNotifications,
  )

  useEffect(() => {
    // We need to check if the user has already enabled notifications and has onboarded the notifications screen
    // and if the user is using Android 13 (API level 33) or above.
    if (
      userProfile.data?.getUserProfile?.documentNotifications &&
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
  }, [userProfile])
}
