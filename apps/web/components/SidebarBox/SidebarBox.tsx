import React, { FC } from 'react'
import {
  Box,
  BoxProps,
  Stack,
  Typography,
  Divider,
} from '@island.is/island-ui/core'

export const SidebarBox: FC<BoxProps> = ({ children, ...props }) => (
  <Box background="purple100" padding={4} borderRadius="large" {...props}>
    {children}
  </Box>
)
