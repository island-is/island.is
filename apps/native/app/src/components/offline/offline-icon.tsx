import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { Image } from 'react-native'

import styled from 'styled-components/native'
import cloudOfflineIcon from '../../assets/icons/cloud-offline-outline.png'
import { useOfflineStore } from '../../stores/offline-store'
import { ComponentRegistry as CR } from '../../utils/component-registry'
import { Pressable } from '../pressable/pressable'
import { router } from 'expo-router'

const Icon = styled(Image)(({ theme }) => ({
  width: theme.spacing[3],
  height: theme.spacing[3],
}))

// @todo migration - show the banner via expo app router.

export const OfflineIcon = () => {
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const bannerVisible = useOfflineStore(({ bannerVisible }) => bannerVisible)

  const onPress = async () => {
    if (!bannerVisible) {
      void impactAsync(ImpactFeedbackStyle.Heavy)
      // router.navigate('/');
      // void Navigation.showOverlay({
      //   component: {
      //     id: CR.OfflineBanner,
      //     name: CR.OfflineBanner,
      //   },
      // })
    } else {
      // router.back();
      // void Navigation.dismissOverlay(CR.OfflineBanner)
    }
  }

  if (isConnected) {
    return null
  }

  return (
    <Pressable onPress={onPress}>
      <Icon source={cloudOfflineIcon} />
    </Pressable>
  )
}
