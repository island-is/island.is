import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './OutlinedBox.treat'
import { Box } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

export interface OutlinedBoxProps {
  children?: React.ReactNode
  backgroundColor?: Colors
}

export const OutlinedBox: FC<OutlinedBoxProps> = ({
  children,
  backgroundColor,
}: OutlinedBoxProps) => (
  <Box className={cn(backgroundColor ? styles.colors[backgroundColor] : null, styles.container)}>
    {children}
  </Box>
)

export default OutlinedBox
