import React, { useEffect, useRef } from 'react'
import { Animated, Easing, LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'
import { screenWidth } from '../../utils/dimensions'

const Container = styled.View`
  position: relative;
  overflow: hidden;
  height: 4px;
  flex: 1;
  background-color: ${({ theme }) => theme.color.mint600};
`

const Bar = styled(Animated.View)`
  flex: 1;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.color.white};
`

type ProgressBarProps = {
  progress: number
  animationDuration?: number
  containerWidth?: number
}

export const ProgressBar = ({
  progress,
  animationDuration = 300,
  containerWidth: originalContainerWidth = screenWidth,
}: ProgressBarProps) => {
  const leftAnim = useRef(new Animated.Value(progress)).current
  const containerWidth = useRef(originalContainerWidth)

  const onLayout = (event: LayoutChangeEvent) => {
    containerWidth.current = event.nativeEvent.layout.width
  }

  useEffect(() => {
    // Since we cannot use percentage directly, we calculate the width as a percentage of the screen width.
    // You might need to adjust this calculation based on your actual UI layout.
    Animated.timing(leftAnim, {
      // Convert progress to an absolute value (based on layout width)
      toValue: (containerWidth.current * progress) / 100,
      // Set duration to 0 if progress is 100, to avoid the animation
      duration: progress === 100 ? 0 : animationDuration,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start()
  }, [progress, animationDuration, leftAnim])

  return (
    <Container onLayout={onLayout}>
      <Bar
        style={{
          left: leftAnim,
        }}
      />
    </Container>
  )
}
