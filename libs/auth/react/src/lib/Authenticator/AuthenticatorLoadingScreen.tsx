import React, { FC } from 'react'
import { Box, LoadingIcon } from '@island.is/island-ui/core'
import * as styles from './AuthenticatorLoadingScreen.treat'

const AuthenticatorLoadingScreen: FC<{}> = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={styles.wrapper}
      role="progressbar"
      aria-valuetext="Er að vinna í innskráningu"
    >
      <LoadingIcon animate size={40} />
    </Box>
  )
}

export default AuthenticatorLoadingScreen
