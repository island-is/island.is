import { Box } from '@island.is/island-ui/core'

export type SimpleCardSkeletonProps = {
  borderColor?: 'blue300' | 'blue600' | 'blue200'
  borderWidth?: 'large' | 'standard'
  borderRadius?: 'large' | 'standard'
  children: any
}

export const SimpleCardSkeleton = ({
  borderColor,
  borderWidth,
  borderRadius,
  children,
}: SimpleCardSkeletonProps) => {
  return (
    <Box
      borderColor={borderColor ? borderColor : 'blue300'}
      borderStyle="solid"
      borderWidth={borderWidth ? borderWidth : 'standard'}
      borderRadius={borderRadius ? borderRadius : 'standard'}
      paddingX={4}
      paddingY={3}
    >
      {children}
    </Box>
  )
}
