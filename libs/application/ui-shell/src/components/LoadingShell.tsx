import React from 'react'

import { Box, LoadingDots } from '@island.is/island-ui/core'

import * as styles from '../lib/FormShell.css'

export const LoadingShell = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="full"
    paddingBottom={20}
    className={styles.root}
  >
    <LoadingDots size="large" />
  </Box>
)
