import React from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'

import * as styles from './LoadingScreen.css'

interface LoadingScreenProps {
  ariaLabel: string
}

export const LoadingScreen = ({ ariaLabel }: LoadingScreenProps) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    className={styles.fullScreen}
    role="progressbar"
    aria-valuetext={ariaLabel}
  >
    <LoadingDots size="large" />
  </Box>
)
