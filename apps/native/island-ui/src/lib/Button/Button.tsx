import React from 'react'
import { View, Text } from 'react-native'
import { theme } from '@island.is/island-ui/theme'

export function Button({ children, backgroundColor = theme.color.blue400 }: { children?: React.ReactNode, backgroundColor?: string }) {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 8,
        padding: 8,
      }}
    >
      <Text style={{ color: theme.color.white }}>{children}</Text>
    </View>
  )
}
