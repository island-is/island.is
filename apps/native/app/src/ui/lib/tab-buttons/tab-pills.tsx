import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { Typography } from '../typography/typography'

const Pill = styled.Pressable<{ isSelected: boolean }>`
  height: 32px;
  padding-horizontal: 8px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.blue400 : theme.color.blue100};
`

const PillText = styled(Typography)<{ isSelected: boolean }>`
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.white : theme.color.blue400};
`

interface TabPill {
  title: string
}

interface TabPillsProps {
  buttons: TabPill[]
  selectedTab: number
  setSelectedTab: (index: number) => void
}

export const TabPills = ({
  buttons,
  selectedTab,
  setSelectedTab,
}: TabPillsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 16 }}
      contentContainerStyle={{ gap: 8 }}
      accessibilityRole="tablist"
    >
      {buttons.map((button, index) => {
        const isSelected = selectedTab === index
        return (
          <Pill
            key={index}
            isSelected={isSelected}
            onPress={() => setSelectedTab(index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${button.title} tab`}
          >
            <PillText
              variant="eyebrow"
              isSelected={isSelected}
              numberOfLines={1}
            >
              {button.title}
            </PillText>
          </Pill>
        )
      })}
    </ScrollView>
  )
}
