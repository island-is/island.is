import React from 'react'
import { Box, LoadingIcon } from '@island.is/island-ui/core'

import * as styles from './ApplicationLoading.treat'

export const ApplicationLoading = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="full"
    className={styles.root}
  >
    <LoadingIcon animate size={50} />
  </Box>
)
