import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor, spacing } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled.Text`
  margin-bottom: ${spacing(3)};
  ${font({
    fontWeight: '600',
    lineHeight: 24,
  })}
  text-align: center;
`

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: ${spacing(5)};
  height: ${spacing(2)};
`

const AnimatedCircle = styled(Animated.View)`
  height: ${spacing(1)};
  width: ${spacing(1)};
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue400,
    dark: theme.color.blue600,
  }))};
`

interface LoaderProps {
  text?: string
}

export function Loader({ text }: LoaderProps) {
  const animRef = useRef<Animated.CompositeAnimation>()
  const scales = useRef<Animated.Value[]>([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  const animation = () => {
    if (animRef.current) {
      scales.forEach((scale) => scale.setValue(0))
      animRef.current.stop()
    }

    const duration = 1400
    const delay = 400

    function seq(i: number) {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(scales[i], {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(scales[i], {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      )
    }
    animRef.current = Animated.stagger(delay, [seq(0), seq(1), seq(2)])
    animRef.current.start()
  }

  useEffect(() => {
    animation()
    return () => {
      if (animRef.current) {
        animRef.current.reset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderCircle = (i: number) => {
    return (
      <AnimatedCircle
        key={`circle-${i}`}
        style={{
          opacity: scales[i].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.4],
          }),
          transform: [
            {
              scale: scales[i].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.8],
              }),
            },
          ],
        }}
      />
    )
  }

  return (
    <Host>
      <View>{text && <Text>{text}</Text>}</View>
      <Wrapper>
        {renderCircle(0)}
        {renderCircle(1)}
        {renderCircle(2)}
      </Wrapper>
    </Host>
  )
}
