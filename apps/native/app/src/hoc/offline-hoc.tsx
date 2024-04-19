import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { ReactNode, useEffect } from 'react'
import { Navigation } from 'react-native-navigation'
import { useAuthStore } from '../stores/auth-store'
import { useOfflineStore } from '../stores/offline-store'
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
  const setBannerHasBeenShown = useOfflineStore(
    ({ setBannerHasBeenShown }) => setBannerHasBeenShown,
  )

  const lockScreenActivatedAt = useAuthStore(
    ({ lockScreenActivatedAt }) => lockScreenActivatedAt,
  )
  const userInfo = useAuthStore(({ userInfo }) => userInfo)

  useEffect(() => {
    if (
      bannerVisible &&
      !bannerHasBeenShown &&
      !isConnected &&
      !lockScreenActivatedAt &&
      userInfo
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
  }, [
    bannerVisible,
    bannerHasBeenShown,
    isConnected,
    lockScreenActivatedAt,
    userInfo,
  ])

  return <>{children}</>
}
