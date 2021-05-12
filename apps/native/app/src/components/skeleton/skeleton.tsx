import React, { useRef, useEffect } from 'react'
import { Dimensions, LayoutChangeEvent, Animated } from 'react-native'
import styled from 'styled-components/native'

interface SkeletonProps {
  active?: boolean
  height?: number
}

const Host = styled.View`
  height: 20px;
  width: 100%;
  background-color: ${(props) => props.theme.color.blue100};
  overflow: hidden;
`

const Swoosh = styled(Animated.View)`
  position: absolute;
  top: -30px;
  left: 0px;
  height: 20px;
  width: 50%;
  background-color: ${(props) => props.theme.color.blue100};
  box-shadow: 0px 25px 25px #d7e2f3;
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
    aw.current = e.nativeEvent.layout.width;
  }

  useEffect(() => {
    if (props.active) {
      animate()
    } else if (ar.current) {
      ar.current.stop()
    }
  }, [props.active]);

  return (
    <Host
      onLayout={onLayout}
    >
      <Swoosh
        style={{ transform: [{ translateX: av.current }, { rotate: '5deg' }] }}
      />
    </Host>
  )
}
