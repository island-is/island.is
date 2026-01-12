import React, { useEffect, useRef } from 'react'
import { Animated, Platform, SafeAreaView, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { isIosLiquidGlassEnabled } from '../../../utils/devices'
import { dynamicColor } from '../../utils'

const Host = styled(Animated.View)`
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade600,
  }))};
`

interface TopLineProps {
  scrollY: Animated.Value
}

export function TopLine({ scrollY }: TopLineProps) {
  const ref = useRef<SafeAreaView>(null)
  const offset = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (Platform.OS === 'ios' && scrollY) {
      scrollY.addListener(() => {
        ref.current?.measureInWindow((x, y, w, h) => offset.setValue(h))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY])

  if (isIosLiquidGlassEnabled) return null

  return (
    <SafeAreaView
      style={{
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 10,
      }}
    >
      <Host
        style={{
          flex: 1,
          height: StyleSheet.hairlineWidth,
          opacity: Animated.add(scrollY, offset).interpolate({
            inputRange: [0, 25, 50],
            outputRange: [0, 0, 1],
          }),
        }}
      />
    </SafeAreaView>
  )
}
