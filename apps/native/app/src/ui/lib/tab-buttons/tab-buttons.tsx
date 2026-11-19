import SegmentedControl from '@react-native-segmented-control/segmented-control'
import React from 'react'
import { PixelRatio, Platform, View } from 'react-native'
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

// The library takes `testIDS` but leaves it out of its types.
const SegmentedControlWithTestIds = SegmentedControl as React.ComponentType<
  React.ComponentProps<typeof SegmentedControl> & { testIDS?: string[] }
>

// On Android the library draws the control itself, 32 high with anything
// taller cut off, so its titles only grow this much with the text size.
const ANDROID_MAX_FONT_SCALE = 1.3
// The library's size for them, before the text size is applied.
const ANDROID_FONT_SIZE = 14

// The system's segmented control on iOS. On Android the library draws its own
// version of it, which fades to 40% when disabled: its raised slider then shows
// a grey box. There it keeps its look and ignores taps instead, and TalkBack
// skips it, since it would offer segments that do nothing.
export const TabButtons = ({
  buttons,
  selectedTab,
  setSelectedTab,
  disabled,
}: TabButtonProps) => {
  const theme = useTheme()
  const titles = buttons.map(({ title }) => title)
  const fontScale = PixelRatio.getFontScale()
  // The text size scales this again: the result is at most the cap.
  const androidFontSize =
    (ANDROID_FONT_SIZE * Math.min(fontScale, ANDROID_MAX_FONT_SCALE)) /
    fontScale

  const control = (
    <SegmentedControlWithTestIds
      values={titles}
      // Android reads these out as the segments' names.
      testIDS={titles}
      selectedIndex={selectedTab}
      onChange={({ nativeEvent }) => {
        if (!disabled) {
          setSelectedTab(nativeEvent.selectedSegmentIndex)
        }
      }}
      enabled={Platform.OS === 'android' || !disabled}
      fontStyle={
        Platform.OS === 'android' ? { fontSize: androidFontSize } : undefined
      }
      activeFontStyle={{
        color: theme.tokens.interactive.foreground.primary,
        ...(Platform.OS === 'android' && { fontSize: androidFontSize }),
      }}
      // Follow the app's theme, not the system's.
      appearance={theme.isDark ? 'dark' : 'light'}
    />
  )

  if (Platform.OS !== 'android') {
    return control
  }
  return (
    <View importantForAccessibility={disabled ? 'no-hide-descendants' : 'auto'}>
      {control}
    </View>
  )
}
