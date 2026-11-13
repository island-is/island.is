import React from 'react'
import { ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Skeleton } from './skeleton'

export const GeneralCardSkeleton = ({
  height,
  style,
}: {
  height: number
  style?: ViewStyle
}) => {
  const theme = useTheme()
  return (
    <Skeleton
      active
      backgroundColor={theme.tokens.background.brandMinimal}
      overlayColor={theme.tokens.background.brandLighter}
      overlayOpacity={1}
      height={height}
      style={{
        borderRadius: 16,
        marginBottom: theme.spacing[2],
        ...style,
      }}
    />
  )
}
