/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { Box, Typography, Divider, Stack } from '@island.is/island-ui/core'

import * as styles from './Sidebar.treat'

interface SidebarProps {
  title: string
}

export const Sidebar: FC<SidebarProps> = ({ title, children }) => {
  return (
    <Box background="purple100" padding={4} className={styles.sidebar}>
      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h4">
          {title}
        </Typography>
        <Divider weight="alternate" />
        {children}
      </Stack>
    </Box>
  )
}

export default Sidebar
