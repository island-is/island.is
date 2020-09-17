import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './OutlinedBox.treat'
import { Box, ResponsiveSpace } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

export interface OutlinedBoxProps {
  children?: React.ReactNode
  backgroundColor?: Colors
  borderColor?: Colors
  padding?: ResponsiveSpace
  paddingX?: ResponsiveSpace,
  paddingY?: ResponsiveSpace,
}

export const OutlinedBox: FC<OutlinedBoxProps> = ({
  children,
  backgroundColor,
  borderColor,
  padding,
  paddingX,
  paddingY,
}: OutlinedBoxProps) => (
  <Box padding={padding}
  paddingX={paddingX}
  paddingY={paddingY}
    className={cn(
      backgroundColor ? styles.backgroundColors[backgroundColor] : null,
      styles.container,
      borderColor ? styles.borderColors[borderColor] : null,
    )}
  >
    {children}
  </Box>
)

export default OutlinedBox
