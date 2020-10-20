import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'

export const Sidebar: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box height="full" paddingTop={[2, 2, 8]} paddingLeft={[0, 0, 0, 4]}>
    {children}
  </Box>
)
