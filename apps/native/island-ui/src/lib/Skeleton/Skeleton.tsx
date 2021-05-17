import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, LayoutChangeEvent, Platform } from 'react-native'
import styled from 'styled-components/native'

interface SkeletonProps {
  active?: boolean
  error?: boolean
  height?: number
}

const Host = styled.View<{ error?: boolean }>`
  height: 20px;
  width: 100%;
  background-color: ${(props) =>
    props.theme.isDark
      ? props.error ? props.theme.color.red600 : props.theme.shade.shade100
      : props.error ? props.theme.color.red200 : props.theme.color.dark100};
  opacity: 0.75;
  overflow: hidden;
`

const Swoosh = styled(Animated.View)`
  position: absolute;
  top: -30px;
  left: 0px;
  height: 20px;
  width: 50%;
  background-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade100
      : props.theme.color.dark100};
  box-shadow: 0px 25px 25px
    ${(props) =>
      props.theme.isDark
        ? props.theme.shade.shade200
        : props.theme.color.dark200};
`

export function Skeleton(props: SkeletonProps) {
  const ar = useRef<Animated.CompositeAnimation>()
  const aw = useRef(Dimensions.get('window').width)
  const av = useRef(new Animated.Value(0))

  const offset = 64
  const animate = () => {
    ar.current = Animated.timing(av.current, {
      duration: 1660,
      toValue: aw.current + offset,
      useNativeDriver: true,
    })

    ar.current.start(() => {
      av.current.setValue(-(aw.current + offset))
      animate()
    })
  }

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
  }, [props.active])

  useEffect(() => {
    return () => {
      if (ar.current) {
        ar.current.stop()
      }
    }
  }, []);

  return (
    <Host onLayout={onLayout} error={props.error}>
      <Swoosh
        style={{
          transform: [{ translateX: av.current }, { rotate: '5deg' }],
          opacity: props.error ? 0 : 1,
          ...Platform.select({
            android: {
              elevation: 50,
              shadowColor: theme.color.dark300,
            },
          }),
        }}
      />
    </Host>
  )
}
