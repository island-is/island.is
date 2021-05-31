import React, { useEffect, useState } from 'react'
import { Animated, View } from 'react-native'
import styled from 'styled-components/native'
import { font } from '../../utils/font';

const Host = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing[3]}px;
  ${font({
    fontWeight: '600',
    lineHeight: 24,
  })}
  text-align: center;
`;

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: ${({ theme }) => theme.spacing[5]}px;
  height: ${({ theme }) => theme.spacing[2]}px;
`;

const AnimatedCircle = styled(Animated.View)`
  height: ${({ theme }) => theme.spacing[1]}px;
  width: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${({ theme }) => theme.color.blue400};
`

interface LoaderProps {
  text?: string;
}

export function Loader({ text }: LoaderProps ) {
  const [scales, _] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ])

  const animation = () => {
    const duration = 1400;
    const delay = 400;

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
    Animated.stagger(delay, [seq(0), seq(1), seq(2)]).start()
  }

  useEffect(() => {
    animation()
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
      <View>
        {text && <Text>{text}</Text>}
      </View>
      <Wrapper>
        {renderCircle(0)}
        {renderCircle(1)}
        {renderCircle(2)}
      </Wrapper>
    </Host>
  )
}
