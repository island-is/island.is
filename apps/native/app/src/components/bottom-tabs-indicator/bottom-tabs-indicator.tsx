import React, { useEffect, useRef, useState } from 'react'
import { Animated, SafeAreaView, useWindowDimensions, View } from 'react-native'
import { useTheme } from 'styled-components'
import { useUiStore } from '../../stores/ui-store'

export function BottomTabsIndicator({
  index,
  total,
}: {
  index: number
  total: number
}) {
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
    <View
      style={{
        position: 'absolute',
        bottom: -29,
        left: 0,
        right: 0,
        height: 30,
        zIndex: 1000,
        shadowColor: theme.color.blue400,
        shadowOffset: {
          width: 0,
          height: -26,
        },
        shadowOpacity: 0.08,
        shadowRadius: 30.0,
        backgroundColor: theme.shade.background,
      }}
    >
      <SafeAreaView>
        <View
          onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width)
          }}
        >
          <Animated.View
            style={{
              width: tabWidth * p,
              height: 1,
              backgroundColor: theme.color.blue400,
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
    </View>
  )
}
