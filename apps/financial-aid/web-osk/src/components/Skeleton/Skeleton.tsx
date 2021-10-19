import React, { ReactNode, useContext, useMemo } from 'react'
import { SkeletonLoader, Box, Divider } from '@island.is/island-ui/core'

import * as styles from './Skeleton.treat'

const Skeleton = () => {
  return (
    <Box>
      <Box marginBottom={6}>
        <SkeletonLoader display="block" height={112} />
      </Box>

      <Box
        display="flex"
        marginTop={6}
        justifyContent="spaceBetween"
        className={styles.wrapper}
      >
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
