import React from 'react'

import { Box } from '@island.is/island-ui/core'

import * as styles from './SharedPageLayout.css'

const SharedPageLayout: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <Box paddingX={[2, 2, 4]}>
      <Box
        className={styles.casesContainer}
        marginX={'auto'}
        marginY={[4, 4, 12]}
      >
        {children}
      </Box>
    </Box>
  )
}

export default SharedPageLayout
