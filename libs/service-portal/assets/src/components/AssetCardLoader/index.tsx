import React from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'

import * as styles from './AssetCardLoader.treat'

export const AssetCardLoader = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="full"
    className={styles.root}
  >
    <LoadingDots large />
  </Box>
)
