import SegmentedControl from '@react-native-segmented-control/segmented-control'
import React from 'react'
import { useTheme } from 'styled-components/native'

interface TabButton {
  title: string
}

interface TabButtonProps {
  buttons: TabButton[]
  selectedTab: number
  setSelectedTab: (index: number) => void
  disabled?: boolean
}

// The system's segmented control on iOS. On Android the library draws its own
// version of it.
export const TabButtons = ({
  buttons,
  selectedTab,
  setSelectedTab,
  disabled,
}: TabButtonProps) => {
  const theme = useTheme()

  return (
    <SegmentedControl
      values={buttons.map(({ title }) => title)}
      selectedIndex={selectedTab}
      onChange={({ nativeEvent }) =>
        setSelectedTab(nativeEvent.selectedSegmentIndex)
      }
      enabled={!disabled}
      activeFontStyle={{ color: theme.tokens.interactive.foreground.primary }}
      // Follow the app's theme, not the system's.
      appearance={theme.isDark ? 'dark' : 'light'}
    />
  )
}
