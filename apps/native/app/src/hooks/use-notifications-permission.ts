import { useCallback, useEffect, useState } from 'react'
import { AppState } from 'react-native'
import {
  getNotificationsPermissionStatus,
  NotificationsPermissionStatus,
} from '../utils/permissions'

/**
 * Tracks whether the OS lets the app post notifications, so screens showing the
 * notification preferences can warn when the two disagree. Re-checks on foreground
 * because the setting may have changed in system settings. `status` is `undefined`
 * until the first check resolves.
 */
export const useNotificationsPermission = () => {
  const [status, setStatus] = useState<
    NotificationsPermissionStatus | undefined
  >(undefined)

  const refresh = useCallback(() => {
    getNotificationsPermissionStatus()
      .then(setStatus)
      .catch(() => setStatus(undefined))
  }, [])

  useEffect(() => {
    refresh()

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refresh()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [refresh])

  return { status, refresh }
}
