import React, { useEffect, useRef } from 'react'
import { Animated, Easing, SafeAreaView } from 'react-native'
import styled from 'styled-components/native'
import { Alert, DARK_YELLOW_200, dynamicColor } from '../../ui'
import { getIntl } from '@/components/providers/locale-provider'
import { useOfflineActions } from '../../stores/offline-store'

const TranslateYValue = 200

const Host = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
`

const Overlay = styled(SafeAreaView)`
  position: relative;
  left: 0;
  right: 0;
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.yellow200,
    dark: DARK_YELLOW_200,
  }))};
`

export const OfflineBanner = () => {
  const intl = getIntl()
  const { toggleBanner } = useOfflineActions()
  const popAnim = useRef(new Animated.Value(-TranslateYValue)).current

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start()
  }

  const popOut = () => {
    Animated.timing(popAnim, {
      toValue: -TranslateYValue,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      toggleBanner(false)
    })
  }

  useEffect(() => {
    popIn()
  }, [])

  return (
    <Host pointerEvents="box-none">
      <Animated.View
        style={{
          transform: [{ translateY: popAnim }],
        }}
      >
        <Overlay>
          <Alert
            type="warning"
            title={intl.formatMessage({ id: 'offline.title' })}
            message={intl.formatMessage({
              id: 'offline.message',
            })}
            hasBottomBorder
            onClose={popOut}
          />
        </Overlay>
      </Animated.View>
    </Host>
  )
}
