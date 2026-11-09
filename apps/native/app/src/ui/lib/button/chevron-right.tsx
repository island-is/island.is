import React from 'react'
import { Image } from 'react-native'
import { useTheme } from 'styled-components/native'
import ChevronForward from '../../assets/icons/chevron-forward.png'

export function ChevronRight() {
  const theme = useTheme()
  return (
    <Image
      source={ChevronForward}
      style={{
        width: 24,
        height: 24,
        tintColor: theme.tokens.interactive.foreground.primary,
      }}
    />
  )
}
