import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'

import * as styles from './Loading.css'

const Loading: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Box className={styles.loadingContainer}>
      <Box className={styles.animatedLoadingContainer}>
        <Text variant="h2" color="dark200">
          Sæki gögn
          <span className={styles.variants['first']}>.</span>
          <span className={styles.variants['second']}>.</span>
          <span className={styles.variants['third']}>.</span>
        </Text>
      </Box>
    </Box>
  )
}

export default Loading
