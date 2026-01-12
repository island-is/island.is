import React from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'

import * as styles from './ApplicationLoading.css'

export const ApplicationLoading = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="full"
    className={styles.root}
  >
    <LoadingDots />
  </Box>
)
