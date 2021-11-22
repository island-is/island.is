import React, { FC } from 'react'
import { Box, BoxProps } from '@island.is/island-ui/core'
import * as styles from './SidebarBox.css'

export const SidebarBox: FC<BoxProps> = ({ children, ...props }) => (
  <Box className={styles.container} padding={[3, 3, 4]} {...props}>
    {children}
  </Box>
)
