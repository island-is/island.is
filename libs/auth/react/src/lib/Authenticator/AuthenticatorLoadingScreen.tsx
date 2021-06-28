import React from 'react'
import { Box, LoadingIcon } from '@island.is/island-ui/core'
import * as styles from './Authenticator.treat'

const AuthenticatorLoadingScreen = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={styles.fullScreen}
      role="progressbar"
      aria-valuetext="Er að vinna í innskráningu"
    >
      <LoadingIcon animate size={40} />
    </Box>
  )
}

export default AuthenticatorLoadingScreen
