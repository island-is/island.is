import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { View } from 'react-native'

export function BottomTabsIndicator({
  index,
  total,
}: {
  index: number
  total: number
}) {

  return (
    <View
      style={{
        position: 'absolute',
        bottom: -9,
        left: 0,
        right: 0,
        height: 10,
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 97, 255, 1)',
        shadowOffset: {
          width: 0,
          height: -8,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8.0,
      }}
    >
      <View
        style={
          {
            width: `${(1 / total) * 100}%`,
            height: 1,
            backgroundColor: theme.color.blue200,
            marginLeft: `${(1 / total) * index * 100}%`,
          }
        }
      />
    </View>
  )
}
