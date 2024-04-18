import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { useEffect } from 'react'
import { Image } from 'react-native'
import { Navigation } from 'react-native-navigation'

import styled from 'styled-components/native'
import warningIcon from '../../assets/icons/warning.png'
import { useOfflineStore } from '../../stores/offline-store'
import { ComponentRegistry as CR } from '../../utils/component-registry'
import { Pressable } from '../pressable/pressable'

const Icon = styled(Image)(({ theme }) => ({
  width: theme.spacing[3],
  height: theme.spacing[3],
}))

export const OfflineIcon = () => {
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const showBanner = useOfflineStore(({ showBanner }) => showBanner)
  const toggleBanner = useOfflineStore(({ toggleBanner }) => toggleBanner)

  const onPress = async () => {
    if (showBanner) {
      void impactAsync(ImpactFeedbackStyle.Heavy)
      void Navigation.showOverlay({
        component: {
          id: CR.OfflineBanner,
          name: CR.OfflineBanner,
        },
      })
    }

    toggleBanner(!showBanner)
  }

  useEffect(() => {
    if (!showBanner) {
      void Navigation.dismissOverlay(CR.OfflineBanner)
    }
  }, [showBanner])

  if (isConnected) {
    return null
  }

  return (
    <Pressable onPress={onPress}>
      <Icon source={warningIcon} />
    </Pressable>
  )
}
