import React, { useEffect, useRef, useState } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

interface TabBarProps {
  values: string[]
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
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 14px;
  line-height: 19px;
`

const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade200
      : props.theme.color.blue200};
`

const ActiveLine = styled(Animated.View)`
  width: 50%;
  height: 1px;
  background-color: ${(props) => props.theme.color.blue400};
`

function hexToRGB(hex: string) {
  const r = parseInt(`0x${hex[1]}${hex[2]}`, 16)
  const g = parseInt(`0x${hex[3]}${hex[4]}`, 16)
  const b = parseInt(`0x${hex[5]}${hex[6]}`, 16)
  return `rgb(${r},${g},${b})`
}

export function TabBar(props: TabBarProps) {
  const win = useWindowDimensions()
  const [width, setWidth] = useState(win.width)
  const { values, selectedIndex, onChange } = props
  const theme = useTheme()
  const animatedIndexNative = useRef(new Animated.Value(selectedIndex))
  const animatedIndex = useRef(new Animated.Value(selectedIndex))
  const indexes = useRef(new Map<number, Animated.Value>())
  const tabWidth = width / props.values.length

  const animateIndex = (toValue: number) => {
    Animated.spring(animatedIndexNative.current, {
      toValue,
      useNativeDriver: true,
      overshootClamping: true,
    }).start()
    Animated.spring(animatedIndex.current, {
      toValue,
      useNativeDriver: false,
      overshootClamping: true,
    }).start()
  }

  const [outputRange, setOutputRange] = useState([
    hexToRGB(theme.shade.foreground),
    hexToRGB(theme.color.blue400),
    hexToRGB(theme.shade.foreground),
  ])

  useEffect(() => {
    setOutputRange([
      hexToRGB(theme.shade.foreground),
      hexToRGB(theme.color.blue400),
      hexToRGB(theme.shade.foreground),
    ])
  }, [theme])

  useEffect(() => {
    animateIndex(selectedIndex)
  }, [selectedIndex])

  const inputRange = [-1, 0, 1]

  return (
    <Host
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width)
      }}
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
                color: theme.color.blue200,
              }}
              key={item + i}
              onPress={() => {
                onChange(i)
                animateIndex(i)
              }}
            >
              <TabTitle
                style={{
                  color: Animated.subtract(
                    animatedIndex.current ?? 1,
                    currentIdx,
                  ).interpolate({ inputRange, outputRange }),
                }}
              >
                {item}
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
                translateX: animatedIndexNative.current.interpolate({
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
