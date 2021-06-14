import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'

const Host = styled(Animated.View)`
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade600,
  }))};
  height: ${StyleSheet.hairlineWidth};
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`

interface TopLineProps {
  scrollY: Animated.Value
  offset?: number
}

export function TopLine({ scrollY, offset = 32 }: TopLineProps) {
  return (
    <Host
      style={{
        height: StyleSheet.hairlineWidth,
        opacity: scrollY.interpolate({
          inputRange: [0, offset],
          outputRange: [0, 1],
        }),
      }}
    />
  )
}
