import React from 'react'
import { Animated, SafeAreaView, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'

const Host = styled(Animated.View)`
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade600,
  }))};
`

interface TopLineProps {
  scrollY: Animated.Value
  offset?: number
}

export function TopLine({ scrollY, offset = 0 }: TopLineProps) {
  return (
    <SafeAreaView style={{ width: '100%', position: 'absolute', top: 0 }}>
      <Host
        style={{
          flex: 1,
          height: StyleSheet.hairlineWidth,
          opacity: scrollY.interpolate({
            inputRange: [0, offset],
            outputRange: [0, 1],
          }),
        }}
      />
    </SafeAreaView>
  )
}
