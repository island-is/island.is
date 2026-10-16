import { useEffect } from 'react'
import { usePreferencesStore } from '../stores/preferences-store'
import { ensureNotificationsPermission } from '../utils/permissions'
import { androidIsVersion33OrAbove } from '../utils/versions-check'
import { isAndroid } from '../utils/devices'

/**
 * Android >= 13 (API level >= 33) requires explicit permission for posting notifications.
 * This hook is for already onboarded users that have enabled notifications and are using Android 13 or above.
 * It then requests the permission if it hasn't been granted yet.
 *
 * They onboarded before POST_NOTIFICATIONS existed, so they were never asked. Users
 * who chose to decide later are skipped and can enable it from the settings screen.
 */
export const useAndroidNotificationPermission = (
  documentNotifications?: boolean,
) => {
  const hasOnboardedNotifications = usePreferencesStore(
    ({ hasOnboardedNotifications }) => hasOnboardedNotifications,
  )
  const hasDeferredNotificationsOnboarding = usePreferencesStore(
    ({ hasDeferredNotificationsOnboarding }) =>
      hasDeferredNotificationsOnboarding,
  )
  const hasRequestedNotificationsPermission = usePreferencesStore(
    ({ hasRequestedNotificationsPermission }) =>
      hasRequestedNotificationsPermission,
  )

  useEffect(() => {
    // Only run on Android devices
    if (!isAndroid || !androidIsVersion33OrAbove()) {
      return
    }

    // Skip unless they enabled notifications, onboarded, and were never asked.
    if (
      !documentNotifications ||
      !hasOnboardedNotifications ||
      hasDeferredNotificationsOnboarding ||
      hasRequestedNotificationsPermission
    ) {
      return
    }

    ensureNotificationsPermission().catch(() => {
      // Nothing to recover here; the settings screen still offers the prompt.
    })
  }, [
    documentNotifications,
    hasOnboardedNotifications,
    hasDeferredNotificationsOnboarding,
    hasRequestedNotificationsPermission,
  ])
}
