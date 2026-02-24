import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useOfflineActions, useOfflineStore } from '@/stores/offline-store'

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
      // @todo migration
      // void Navigation.showOverlay({
      //   component: {
      //     id: CR.OfflineBanner,
      //     name: CR.OfflineBanner,
      //   },
      // })
      setBannerHasBeenShown(true)
    }
  }, [bannerVisible, bannerHasBeenShown, isConnected, lockScreenActivatedAt])

  return <>{children}</>
}
