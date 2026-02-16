import { selectionAsync } from 'expo-haptics'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

interface TabBarValue {
  label: string
  testID?: string
}

interface TabBarProps {
  values: TabBarValue[]
  selectedIndex: number
  onChange(index: number): void
}

const Host = styled.SafeAreaView``

const Tabs = styled.View`
  flex-direction: row;
`

const Tab = styled.Pressable`
  flex: 1;
  padding: 20px 15px;
  align-items: center;
  justify-content: center;
`

const TabTitle = styled(Animated.Text)`
  ${font({
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 19,
  })}
`

const Line = styled.View`
  width: 100%;
  height: ${({ theme }) => theme.border.width.standard}px;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade200,
    light: theme.color.blue200,
  }))};
`

const ActiveLine = styled(Animated.View)`
  width: 50%;
  height: ${({ theme }) => theme.border.width.standard}px;
  background-color: ${dynamicColor((props) => props.theme.color.blue400)};
`

export function TabBar(props: TabBarProps) {
  const win = useWindowDimensions()
  const [width, setWidth] = useState(win.width)
  const { values, selectedIndex, onChange } = props
  const theme = useTheme()
  const animatedIndex = useRef(new Animated.Value(selectedIndex))
  const indexes = useRef(new Map<number, Animated.Value>())
  const tabWidth = width / props.values.length
  const animRef = useRef<Animated.CompositeAnimation>()

  const animateIndex = (toValue: number) => {
    animRef.current = Animated.spring(animatedIndex.current, {
      toValue,
      useNativeDriver: true,
    })
    animRef.current.start()
  }

  useEffect(() => {
    animateIndex(selectedIndex)
  }, [selectedIndex])

  useEffect(() => {
    return () => {
      if (animRef.current) {
        animRef.current.stop()
      }
    }
  }, [])

  const inputRange = [-1, 0, 1]

  return (
    <Host
      onLayout={(e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width)
      }}
      accessibilityRole="tablist"
    >
      <Tabs>
        {values.map((item, i) => {
          let currentIdx = indexes.current.get(i)
          if (!currentIdx) {
            currentIdx = new Animated.Value(i)
            indexes.current.set(i, currentIdx)
          }
          return (
            <Tab
              android_ripple={{
                color: theme.isDark ? '#003790' : theme.color.blue200,
              }}
              key={item.label + i}
              onPress={() => {
                onChange(i)
                animateIndex(i)
                selectionAsync()
              }}
              testID={item.testID}
              accessibilityRole="tab"
            >
              <TabTitle
                accessibilityLabel=""
                style={{
                  opacity: Animated.subtract(
                    animatedIndex.current ?? 1,
                    currentIdx,
                  ).interpolate({ inputRange, outputRange: [1, 0, 1] }),
                }}
              >
                {item.label}
              </TabTitle>
              <TabTitle
                style={{
                  color: theme.color.blue400,
                  position: 'absolute',
                  opacity: Animated.subtract(
                    animatedIndex.current ?? 1,
                    currentIdx,
                  ).interpolate({
                    inputRange,
                    outputRange: [0, 1, 0],
                  }),
                }}
              >
                {item.label}
              </TabTitle>
            </Tab>
          )
        })}
      </Tabs>
      <Line>
        <ActiveLine
          style={{
            width: tabWidth,
            transform: [
              {
                translateX: animatedIndex.current.interpolate({
                  inputRange: props.values.map((_, i) => i),
                  outputRange: props.values.map((_, i) => i * tabWidth),
                }),
              },
            ],
          }}
        />
      </Line>
    </Host>
  )
}
