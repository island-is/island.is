import React, { useRef, useState } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'

const Dots = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: ${({ theme }) => theme.spacing[3]}px;
  padding-right: 24px;
`
const DotContainer = styled(Animated.View)`
  flex-direction: row;
  position: relative;
`

const DotLeft = styled(Animated.View)`
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.theme.color.red400};
  border-radius: 4px;
`

const DotCenter = styled(Animated.View)`
  width: 1px;
  height: 8px;
  background-color: ${(props) => props.theme.color.red400};
`

const DotRight = styled(Animated.View)`
  width: 8px;
  height: 8px;
  margin-left: -1px;
  background-color: ${(props) => props.theme.color.red400};
  border-radius: 4px;
`

const DotOver = styled(Animated.View)`
  position: absolute;
  width: 1px;
  height: 8px;
  background-color: ${dynamicColor('background')};
`

interface ViewPagerProps {
  itemWidth?: number
  children: React.ReactNode
}

export function ViewPager({ children, itemWidth }: ViewPagerProps) {
  const pages = React.Children.count(children)
  const OFFSET_CARD = itemWidth ?? 283
  const OFFSET = OFFSET_CARD
  const PEEK = 16

  const [viewportWidth, setViewportWidth] = useState(0)

  const snapOffsets = Array.from({ length: pages }, (_, i) => {
    if (i === 0) return 0
    if (i === pages - 1 && viewportWidth > 0) {
      return pages * OFFSET_CARD - viewportWidth + PEEK
    }
    return i * OFFSET_CARD - PEEK
  })

  const inputRange = (i: number) => {
    const curr = snapOffsets[i]
    const prev = i === 0 ? curr - OFFSET : snapOffsets[i - 1]
    const next = i === pages - 1 ? curr + OFFSET : snapOffsets[i + 1]
    return [prev, curr, next]
  }

  const x = useRef(new Animated.Value(0)).current

  if (pages === 0) {
    return null
  }

  return (
    <>
      <Animated.ScrollView
        scrollEventThrottle={16}
        style={{ marginLeft: -16, marginRight: -16 }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x,
                },
              },
            },
          ],
          { useNativeDriver: true },
        )}
        contentContainerStyle={{
          paddingRight: 16,
        }}
        onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
        horizontal={true}
        snapToOffsets={snapOffsets}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'start'}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        decelerationRate={0}
      >
        {children}
      </Animated.ScrollView>
      <Dots>
        {Array.from({ length: pages }).map((_, i) => (
          <DotContainer
            key={i}
            style={{
              transform: [
                { translateX: 16 * -0.5 },
                {
                  translateX: x.interpolate({
                    inputRange: inputRange(i),
                    outputRange: [24, 0, 0],
                    extrapolate: 'clamp',
                  }),
                },
                { translateX: 16 * 0.5 },
              ],
            }}
          >
            <DotLeft style={{ transform: [{ translateX: 4 }] }} />
            <DotCenter
              style={{
                transform: [
                  { translateX: 1 * -0.5 },
                  {
                    scaleX: x.interpolate({
                      inputRange: inputRange(i),
                      outputRange: [0, 24, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                  { translateX: 1 * 0.5 },
                ],
              }}
            />
            <DotRight
              style={{
                transform: [
                  { translateX: 8 * -0.5 },
                  {
                    translateX: x.interpolate({
                      inputRange: inputRange(i),
                      outputRange: [-4, 24 - 4, -4],
                      extrapolate: 'clamp',
                    }),
                  },
                  { translateX: 8 * 0.5 },
                ],
              }}
            />
            <DotOver
              style={{
                transform: [
                  { translateX: 2 },
                  {
                    scaleX: x.interpolate({
                      inputRange: inputRange(i),
                      outputRange: [16, 32, 16],
                      extrapolate: 'clamp',
                    }),
                  },
                  { translateX: 0.5 },
                ],
                opacity: x.interpolate({
                  inputRange: inputRange(i),
                  outputRange: [0.75, 0, 0.75],
                  extrapolate: 'clamp',
                }),
              }}
            />
          </DotContainer>
        ))}
      </Dots>
    </>
  )
}
