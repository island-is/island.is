import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useOfflineActions, useOfflineStore } from '@/stores/offline-store'
import { OfflineBanner } from '../offline/offline-banner'

interface OfflineHocProps {
  children: ReactNode
}

export const OfflineProvider = ({ children }: OfflineHocProps) => {
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const bannerHasBeenShown = useOfflineStore(
    ({ bannerHasBeenShown }) => bannerHasBeenShown,
  )
  const bannerVisible = useOfflineStore(({ bannerVisible }) => bannerVisible)
  const { setBannerHasBeenShown } = useOfflineActions()

  const lockScreenActivatedAt = useAuthStore(
    ({ lockScreenActivatedAt }) => lockScreenActivatedAt,
  )

  useEffect(() => {
    if (
      bannerVisible &&
      !bannerHasBeenShown &&
      !isConnected &&
      !lockScreenActivatedAt
    ) {
      void impactAsync(ImpactFeedbackStyle.Heavy)
      setBannerHasBeenShown(true)
    }
  }, [bannerVisible, bannerHasBeenShown, isConnected, lockScreenActivatedAt])

  return (
    <>
      {children}
      {<OfflineBanner />}
    </>
  )
}
