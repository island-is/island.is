import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { Image } from 'react-native'

import styled from 'styled-components/native'
import cloudOfflineIcon from '../../assets/icons/cloud-offline-outline.png'
import { useOfflineActions, useOfflineStore } from '../../stores/offline-store'
import { Pressable } from '../pressable/pressable'
import { LoadingIcon } from '../nav-loading-spinner/loading-icon'

const Icon = styled(Image)(({ theme }) => ({
  width: theme.spacing[3],
  height: theme.spacing[3],
}))

export const OfflineIcon = () => {
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const bannerVisible = useOfflineStore(({ bannerVisible }) => bannerVisible)
  const { toggleBanner } = useOfflineActions()

  const onPress = () => {
    if (!bannerVisible) {
      void impactAsync(ImpactFeedbackStyle.Heavy)
      toggleBanner(true)
    } else {
      toggleBanner(false)
    }
  }

  if (!isConnected) {
    return <LoadingIcon />
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
