import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './Sidebar.treat'

const Sidebar: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box background="blue100" height="full" className={styles.root}>
    {children}
  </Box>
)

export default Sidebar
