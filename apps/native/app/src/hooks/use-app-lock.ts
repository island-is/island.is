import { usePathname, useRouter } from 'expo-router'
import { useEffect } from 'react'

import { config } from '@/config'
import { useAuthStore } from '@/stores/auth-store'
import { usePreferencesStore } from '@/stores/preferences-store'
import { isOnboarded } from '@/utils/onboarding'

const LOCK_PATHNAME = '/app-lock'

function useShouldShowLock() {
  const lockScreenActivatedAt = useAuthStore((s) => s.lockScreenActivatedAt)
  const lockScreenSuppressedUntil = useAuthStore(
    (s) => s.lockScreenSuppressedUntil,
  )
  const authorizeResult = useAuthStore((s) => s.authorizeResult)
  const dev__useLockScreen = usePreferencesStore((s) => s.dev__useLockScreen)

  if (lockScreenActivatedAt === undefined) return false
  if (!authorizeResult) return false
  if (!isOnboarded()) return false
  if (config.isTestingApp) return false
  if (dev__useLockScreen === false) return false
  // Suppression hides the overlay but doesn't stop background-stamping —
  // when it clears, the lock shows if the user backgrounded in the meantime.
  if (
    lockScreenSuppressedUntil != null &&
    Date.now() < lockScreenSuppressedUntil
  ) {
    return false
  }
  return true
}

/**
 * Pushes /app-lock when the lock should show, dismisses on unlock. The route
 * is a fullScreenModal so iOS chained presentation layers it above any
 * current modal, preserving the underlying screen through the lock cycle.
 */
export function useAppLock() {
  const router = useRouter()
  const pathname = usePathname()
  const shouldShow = useShouldShowLock()
  const isOnLock = pathname === LOCK_PATHNAME

  useEffect(() => {
    if (shouldShow && !isOnLock) {
      router.push(LOCK_PATHNAME)
    } else if (!shouldShow && isOnLock) {
      router.back()
    }
  }, [shouldShow, isOnLock, router])
}
