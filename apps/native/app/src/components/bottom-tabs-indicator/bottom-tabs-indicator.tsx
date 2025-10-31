import React, { useEffect, useRef, useState } from 'react'
import { Animated, SafeAreaView, View, useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { useUiStore } from '../../stores/ui-store'
import { dynamicColor } from '../../ui'
import { isIosLiquidGlassEnabled } from '../../utils/devices'

const Host = styled.View`
  position: absolute;
  bottom: -29px;
  left: 0px;
  right: 0px;
  height: 30px;
  z-index: 101;
  background-color: ${dynamicColor('background')};
`

const Active = styled(Animated.View)`
  background-color: ${(props) => props.theme.color.blue400};
`

type BottomTabsIndicatorProps = {
  index: number
  total: number
}

export function BottomTabsIndicator(props: BottomTabsIndicatorProps) {
  if (isIosLiquidGlassEnabled) {
    return null
  }

  return <BottomTabsIndicatorInner {...props} />
}

function BottomTabsIndicatorInner({ index, total }: BottomTabsIndicatorProps) {
  const theme = useTheme()
  const win = useWindowDimensions()
  const { selectedTab, unselectedTab } = useUiStore()
  const [width, setWidth] = useState(win.width)

  const p = 1.0
  const h = (1.0 - p) / 2
  const av = useRef(new Animated.Value(index)).current
  const tabWidth = width / total
  const anim = useRef<Animated.CompositeAnimation>()

  useEffect(() => {
    if (anim.current) {
      anim.current.stop()
    }
    av.setValue(unselectedTab)
    anim.current = Animated.spring(av, {
      overshootClamping: true,
      toValue: selectedTab,
      useNativeDriver: true,
    })
    anim.current.start()
  }, [selectedTab, unselectedTab])

  return (
    <Host
      style={{
        shadowColor: theme.color.blue400,
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12.0,
        elevation: 1,
      }}
    >
      <SafeAreaView>
        <View
          style={{}}
          onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width)
          }}
        >
          <Active
            style={{
              zIndex: 102,
              width: tabWidth * p,
              height: 1,
              transform: [
                {
                  translateX: av.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [
                      0,
                      tabWidth * 4 * h + tabWidth * p,
                      tabWidth * 8 * h + tabWidth * p * 2,
                    ],
                  }),
                },
              ],
            }}
          />
        </View>
      </SafeAreaView>
    </Host>
  )
}
