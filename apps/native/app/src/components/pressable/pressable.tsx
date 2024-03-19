import React, { ReactNode, useRef } from 'react'
import {
  AccessibilityRole,
  AccessibilityState,
  Animated,
  Pressable as RNPressable,
  StyleProp,
  ViewStyle,
} from 'react-native'

interface PressableProps {
  children: ReactNode
  accessibilityRole?: AccessibilityRole
  accessibilityLabel?: string
  accessibilityState?: AccessibilityState
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  onPress?(): void
  onLongPress?(): void
}

export const Pressable = ({
  children,
  accessibilityRole,
  accessibilityLabel,
  accessibilityState,
  style,
  disabled,
  onPress,
  onLongPress,
}: PressableProps) => {
  const animate = useRef(new Animated.Value(0)).current

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(animate, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    }
  }

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(animate, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
  }

  const interpolatedScale = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.975],
  })

  const pressableStyle = {
    transform: [{ scale: interpolatedScale }],
  }

  return (
    <Animated.View
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      style={[pressableStyle, style]}
    >
      <RNPressable
        disabled={!onPress || disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        {children}
      </RNPressable>
    </Animated.View>
  )
}
