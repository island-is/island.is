import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { ReactNode, useEffect } from 'react'
import { Navigation } from 'react-native-navigation'
import { useAuthStore } from '../stores/auth-store'
import { useOfflineActions, useOfflineStore } from '../stores/offline-store'
import { ComponentRegistry as CR } from '../utils/component-registry'

interface OfflineHocProps {
  children: ReactNode
}

export const OfflineHoc = ({ children }: OfflineHocProps) => {
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
      void Navigation.showOverlay({
        component: {
          id: CR.OfflineBanner,
          name: CR.OfflineBanner,
        },
      })
      setBannerHasBeenShown(true)
    }
  }, [bannerVisible, bannerHasBeenShown, isConnected, lockScreenActivatedAt])

  return <>{children}</>
}
