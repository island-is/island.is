import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

import * as styles from './ProgressIndicator.treat'

const ProgressIndicator: FC<{ progress: number }> = ({ progress }) => (
  <>
    <Box
      paddingTop={[0, 3]}
      paddingBottom={[0, 3]}
      paddingLeft={[0, 5]}
      paddingRight={[0, 5]}
      className={styles.root}
      display={['none', 'none', 'block']}
    >
      <Box display="flex" justifyContent="spaceBetween">
        <Typography variant="pSmall" color="dark400">
          Progress
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="spaceBetween">
        <Box display="flex" className={styles.progressContainer}>
          <Box
            className={styles.progress}
            style={{ width: `${progress}%` }}
          ></Box>
        </Box>
        <Box className={styles.progressNumber}>
          <Typography variant="pSmall" color="blue400">{`${Math.round(
            progress,
          )}%`}</Typography>
        </Box>
      </Box>
    </Box>
    <Box
      display={['flex', 'flex', 'none']}
      className={styles.progressContainer}
    >
      <Box className={styles.progress} style={{ width: `${progress}%` }}></Box>
    </Box>
  </>
)

export default ProgressIndicator
