import React, { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  ColorValue,
  Dimensions,
  DynamicColorIOS,
  DynamicColorIOSTuple,
  LayoutChangeEvent,
  Platform,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { dynamicColor } from '../../utils'

interface SkeletonProps {
  active?: boolean
  error?: boolean
  height?: number
  style?: ViewStyle
  backgroundColor?: ColorValue | DynamicColorIOSTuple
  overlayColor?: ColorValue | DynamicColorIOSTuple
  overlayOpacity?: number
}

const Host = styled.View<{ error?: boolean }>`
  height: 20px;
  width: 100%;
  background-color: ${dynamicColor(({ theme, error }) => ({
    dark: error ? theme.color.red600 : theme.shades.dark.shade100,
    light: error ? theme.color.red200 : theme.color.dark100,
  }))};
  opacity: 1;
  overflow: hidden;
`

const Swoosh = styled(Animated.View)`
  position: absolute;
  left: 0px;
  width: 50%;
`

export function Skeleton(props: SkeletonProps) {
  const theme = useTheme()
  const ar = useRef<Animated.CompositeAnimation>()
  const aw = useRef(Dimensions.get('window').width)
  const av = useRef(new Animated.Value(0))
  const mounted = useRef(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseDynamicColor = ({ dark, light }: any) => {
    if (Platform.OS === 'android') {
      return theme.isDark ? dark : light
    }
    return DynamicColorIOS({
      light,
      dark,
    })
  }

  const overlayColor = baseDynamicColor(
    typeof props.overlayColor === 'object' &&
      props.overlayColor.light &&
      props.overlayColor.dark
      ? props.overlayColor
      : {
          light: props.overlayColor ?? theme.shades.light.foreground,
          dark: props.overlayColor ?? theme.shades.dark.shade600,
        },
  )

  const backgroundColor = baseDynamicColor(
    typeof props.backgroundColor === 'object' &&
      props.backgroundColor.light &&
      props.backgroundColor.dark
      ? props.backgroundColor
      : {
          light: props.backgroundColor ?? theme.shades.light.shade100,
          dark: props.backgroundColor ?? theme.shades.dark.shade200,
        },
  )

  const { active, error, height = 20, style } = props
  const { overlayOpacity = height / aw.current } = props

  const offset = aw.current
  const animate = useCallback(() => {
    if (!mounted.current) {
      return
    }
    ar.current = Animated.timing(av.current, {
      duration: 1660,
      toValue: aw.current + offset,
      useNativeDriver: true,
    })

    ar.current.start(() => {
      av.current.setValue(-(aw.current + offset))
      animate()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ar.current, props.active])

  const onLayout = (e: LayoutChangeEvent) => {
    aw.current = e.nativeEvent.layout.width
  }

  useEffect(() => {
    if (props.active) {
      animate()
    } else if (ar.current) {
      ar.current.stop()
      av.current.setValue(-(aw.current + offset))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      ar.current?.reset()
    }
  }, [])

  return (
    <Host
      onLayout={onLayout}
      error={error}
      style={[style, { height, backgroundColor }]}
    >
      <Swoosh
        style={{
          height,
          top: -Math.floor(height + height * 0.5),
          shadowOffset: {
            width: 0,
            height: Math.floor(height),
          },
          backgroundColor,
          shadowColor: overlayColor,
          shadowRadius: Math.floor(height),
          shadowOpacity: overlayOpacity,
          transform: [{ translateX: av.current }, { rotate: '5deg' }],
          opacity: props.error ? 0 : 1,
          ...Platform.select({
            android: {
              elevation: height * 2,
              shadowColor: overlayColor,
            },
          }),
        }}
      />
    </Host>
  )
}
