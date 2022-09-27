import React from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './AssetCardLoader.css'
import { CardLoader } from '@island.is/service-portal/core'

export const AssetCardLoader = () => (
  <Box width="full" className={styles.root}>
    <CardLoader />
  </Box>
)
