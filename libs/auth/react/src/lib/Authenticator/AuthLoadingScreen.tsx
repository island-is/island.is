import React from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import * as styles from './Auth.css'

export const AuthLoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    className={styles.fullScreen}
    role="progressbar"
    aria-valuetext="Er að vinna í innskráningu"
  >
    <LoadingDots large />
  </Box>
)
