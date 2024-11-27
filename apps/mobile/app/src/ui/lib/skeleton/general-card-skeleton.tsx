import React from 'react'
import { useTheme } from 'styled-components/native'
import { Skeleton } from './skeleton'

export const GeneralCardSkeleton = ({ height }: { height: number }) => {
  const theme = useTheme()
  return (
    <Skeleton
      active
      backgroundColor={{
        dark: theme.shades.dark.shade300,
        light: theme.color.blue100,
      }}
      overlayColor={{
        dark: theme.shades.dark.shade200,
        light: theme.color.blue200,
      }}
      overlayOpacity={1}
      height={height}
      style={{
        borderRadius: 16,
        marginBottom: theme.spacing[2],
      }}
    />
  )
}
