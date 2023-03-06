import React, { ReactNode } from 'react'
import {
  Platform,
  Pressable,
  PressableProps,
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native'
import { useTheme } from 'styled-components/native'

interface PressableHighlightProps extends PressableProps {
  highlightColor?: string
  children: ReactNode
}

export function PressableHighlight({
  children,
  highlightColor,
  ...rest
}: PressableHighlightProps) {
  const theme = useTheme()
  const color =
    highlightColor ??
    Platform.select({
      android: theme.isDark ? '#001333' : theme.color.blue200,
      ios: theme.isDark ? '#001333' : theme.color.blue100,
    })

  if (Platform.OS === 'ios') {
    return (
      <TouchableHighlight
        underlayColor={color}
        {...(rest as TouchableHighlightProps)}
      >
        {children}
      </TouchableHighlight>
    )
  }

  return (
    <Pressable
      android_ripple={{
        color,
      }}
      {...rest}
    >
      {children}
    </Pressable>
  )
}
