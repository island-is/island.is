import React from 'react'

import { Box, SkeletonLoader } from '@island.is/island-ui/core'

import * as styles from './Skeleton.css'

const Skeleton = () => {
  return (
    <Box className={styles.container}>
      <Box className={styles.wrapper}>
        <Box className={styles.boxWidthPercent}>
          <SkeletonLoader display="block" height={880} />
        </Box>
        <Box className={styles.sideBarWidth}>
          <SkeletonLoader display="block" height={880} />
        </Box>
      </Box>
    </Box>
  )
}

export default Skeleton
