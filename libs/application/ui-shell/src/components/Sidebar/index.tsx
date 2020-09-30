import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'

const Sidebar: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box height="full" paddingTop={[4, 8]} paddingLeft={[0, 0, 0, 4]}>
    {children}
  </Box>
)

export default Sidebar
