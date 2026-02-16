import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../ui'

interface VisualizedPinCodeProps {
  code: string
  invalid: boolean
  minChars?: number
  maxChars?: number
  style?: ViewStyle
}

const Host = styled(Animated.View)`
  flex-direction: row;
`

const Dot = styled(Animated.View)<{ state?: 'active' | 'inactive' | 'error' }>`
  position: absolute;
  top: 0;
  left: 0;

  width: 16px;
  height: 16px;

  border-radius: 8px;

  background-color: ${dynamicColor((props) => ({
    dark:
      props.state === 'active'
        ? props.theme.color.blue400
        : props.state === 'inactive'
        ? props.theme.shades.dark.shade400
        : props.theme.color.red400,
    light:
      props.state === 'active'
        ? props.theme.color.blue400
        : props.state === 'inactive'
        ? props.theme.color.blue100
        : props.theme.color.red400,
  }))};
  z-index: ${(props) =>
    props.state === 'inactive' ? 2 : props.state === 'active' ? 3 : 4};
`

const DotGroup = styled.View`
  position: relative;
  width: 16px;
  height: 16px;
  margin: 0px 8px;
`

const animateX = (value: Animated.Value, toValue: number, tension: number) =>
  Animated.spring(value, {
    toValue,
    useNativeDriver: true,
    overshootClamping: true,
    tension,
  })

export function VisualizedPinCode({
  code,
  invalid,
  minChars = 4,
  maxChars = 6,
  style,
}: VisualizedPinCodeProps) {
  const charsCount = Math.max(minChars, Math.min(maxChars, code.length))
  const value = useRef(new Animated.Value(0))
  const animation = useRef<Animated.CompositeAnimation>()
  const colorAnimation = useRef<Animated.CompositeAnimation>()

  const opacityForError = useRef(new Animated.Value(0))
  const colors = useRef(
    Array.from({ length: maxChars }).map(
      (n, i) => new Animated.Value(i < code.length ? 1 : 0),
    ),
  )

  const shake = useCallback(() => {
    if (animation.current) {
      animation.current.stop()
    }

    Animated.spring(opacityForError.current, {
      toValue: 1,
      useNativeDriver: true,
    }).start()

    value.current.setValue(0)

    animation.current = Animated.sequence([
      animateX(value.current, 10, 350),
      animateX(value.current, -10, 250),
      animateX(value.current, 10, 250),
      animateX(value.current, -10, 250),
      animateX(value.current, 0, 100),
      Animated.delay(330),
    ])

    animation.current.start()
  }, [])

  useEffect(() => {
    if (invalid) {
      shake()
    }
  }, [invalid])

  useEffect(() => {
    Animated.spring(opacityForError.current, {
      toValue: 0,
      useNativeDriver: true,
    }).start()

    colorAnimation.current = Animated.parallel(
      colors.current.map((color, i) =>
        Animated.spring(color, {
          toValue: i < code.length ? 1 : 0,
          useNativeDriver: true,
        }),
      ),
    )

    colorAnimation.current.start()
  }, [code])

  return (
    <Host style={[{ transform: [{ translateX: value.current }] }, style]}>
      {Array.from({ length: charsCount }).map((n, i) => (
        <DotGroup key={i}>
          <Dot state="inactive" />
          <Dot state="active" style={{ opacity: colors.current[i] }} />
          <Dot state="error" style={{ opacity: opacityForError.current }} />
        </DotGroup>
      ))}
    </Host>
  )
}
