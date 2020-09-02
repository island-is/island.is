import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './Sidebar.treat'

const Sidebar: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    background="purple100"
    borderRadius="large"
    height="full"
    paddingTop={[4, 8]}
    paddingX={[4, 6]}
    className={styles.root}
  >
    {children}
  </Box>
)

export default Sidebar
