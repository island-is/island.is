import React from 'react'
import { View, Text } from 'react-native'
import { theme } from '@island.is/island-ui/theme'

export function Button({ children }: { children?: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.color.blue600,
        borderRadius: 8,
        padding: 8,
      }}
    >
      <Text style={{ color: theme.color.blue300 }}>{children}</Text>
    </View>
  )
}
