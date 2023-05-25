import { Box, BoxProps } from '@island.is/island-ui/core'
import { ReactNode } from 'react'

interface Props extends BoxProps {
  borderColor?: 'blue300' | 'blue600' | 'blue200' | 'blue400'
  borderWidth?: 'large' | 'standard'
  borderRadius?: 'large' | 'standard'
  children: ReactNode
  className?: string
}

const CardSkeleton = ({
  borderColor,
  borderWidth,
  borderRadius,
  children,
  className,
  ...props
}: Props) => {
  return (
    <Box
      borderColor={borderColor ? borderColor : 'blue300'}
      borderStyle="solid"
      borderWidth={borderWidth ? borderWidth : 'standard'}
      borderRadius={borderRadius ? borderRadius : 'standard'}
      paddingX={4}
      paddingY={3}
      className={className}
      {...props}
    >
      {children}
    </Box>
  )
}
export default CardSkeleton
