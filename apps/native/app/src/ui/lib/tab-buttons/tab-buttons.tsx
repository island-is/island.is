import React, { useCallback, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  border-radius: ${({ theme }) => theme.border.radius.large};
  justify-content: center;
  background-color: ${({ theme }) => theme.color.blue100};
  position: relative;
`

const Tabs = styled.View`
  flex-direction: row;
`

const TabText = styled(Typography)<{ isSelected: boolean }>`
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.blue400 : theme.color.dark400};
  font-weight: ${({ isSelected }) => (isSelected ? '600' : '400')};
`

const Tab = styled.Pressable<{ isSelected: boolean }>`
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  flex: 1;
`

const ActiveBackground = styled(Animated.View)<{ buttonWidth: number }>`
  position: absolute;

  background-color: ${({ theme }) => theme.color.white};
  border-radius: 6px;
  margin-horizontal: 2px;
  height: 38px;
  width: ${({ buttonWidth }) => buttonWidth}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.blue200};
`

interface TabButton {
  title: string
}

interface TabButtonProps {
  buttons: TabButton[]
  selectedTab: number
  setSelectedTab: (index: number) => void
}

function getButtonWidth(
  numButtons: number,
  containerWidth: number,
  spacing = 32,
) {
  return (containerWidth) / numButtons
}

export const TabButtons = ({
  buttons,
  selectedTab,
  setSelectedTab,
}: TabButtonProps) => {
  const [buttonWidth, setButtonWidth] = useState(
    getButtonWidth(buttons.length, Dimensions.get('window').width),
  )

  const translateX = useRef(new Animated.Value(0)).current

  const onTabPress = useCallback(
    (index: number) => {
      Animated.spring(translateX, {
        toValue: index * buttonWidth,
        useNativeDriver: true,
        overshootClamping: true,
        mass: 1,
      }).start()
      setSelectedTab(index)
    },
    [buttonWidth, translateX, setSelectedTab],
  )

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setButtonWidth(getButtonWidth(buttons.length, e.nativeEvent.layout.width))
  }, [])

  return (
    <Host accessibilityRole="tablist" onLayout={onLayout}>
      <ActiveBackground
        buttonWidth={buttonWidth}
        style={{ transform: [{ translateX: translateX }] }}
      />
      <Tabs>
        {buttons.map((button, index) => {
          const isSelected = selectedTab === index
          return (
            <Tab
              key={index}
              onPress={() => onTabPress(index)}
              isSelected={isSelected}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${button.title} tab`}
            >
              <TabText variant="body3" isSelected={isSelected}>
                {button.title}
              </TabText>
            </Tab>
          )
        })}
      </Tabs>
    </Host>
  )
}
