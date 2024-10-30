import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Animated, useWindowDimensions } from 'react-native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  border-radius: ${({ theme }) => theme.border.radius.large};
  justify-content: center;
  background-color: ${({ theme }) => theme.color.blue100};
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
  background-color: ${({ isSelected }) =>
    isSelected ? 'white' : 'transparent'};
  border-width: ${({ isSelected }) => (isSelected ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.color.blue200};
  border-radius: 6px;
  flex: 1;
`

const ActiveBackground = styled(Animated.View)`
  position: absolute;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 6px;
  margin-horizontal: 2px;
  height: 38px;
`

interface TabButton {
  title: string
}

interface TabButtonProps {
  buttons: TabButton[]
  selectedTab: number
  setSelectedTab: (index: number) => void
}

export const TabButtons = ({
  buttons,
  selectedTab,
  setSelectedTab,
}: TabButtonProps) => {
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const buttonWidth = (width - theme.spacing[4]) / buttons.length

  const handlePress = (index: number) => {
    setSelectedTab(index)
  }

  const onTabPress = (index: number) => {
    handlePress(index)
  }

  return (
    <Host accessibilityRole="tabbar">
      <ActiveBackground />
      <Tabs>
        {buttons.map((button, index) => {
          const isSelected = selectedTab === index
          return (
            <Tab
              key={index}
              onPress={() => onTabPress(index)}
              isSelected={isSelected}
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
