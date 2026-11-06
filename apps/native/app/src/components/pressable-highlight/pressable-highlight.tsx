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
  children: ReactNode
}

// Pressed rows all use `app.background.pressed`. A row's own background goes
// on this component's style, not on the child, so the pressed colour can
// replace it.
export function PressableHighlight({
  children,
  ...rest
}: PressableHighlightProps) {
  const theme = useTheme()
  const color = theme.tokens.app.background.pressed

  if (Platform.OS === 'ios') {
    return (
      <TouchableHighlight
        underlayColor={color}
        activeOpacity={1}
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
