import React from 'react'
import { ViewStyle } from 'react-native'

type NavigationBarSheetProps = {
  title?: React.ReactNode
  componentId?: string
  onClosePress(): void
  style?: ViewStyle
  showLoading?: boolean
  closable?: boolean
  testID?: string
}

export function NavigationBarSheet(props: NavigationBarSheetProps) {
  return null
}
