import React, { FC } from 'react'
import { Box, LoadingIcon } from '@island.is/island-ui/core'
import * as styles from './Authenticator.treat'

const AuthenticatorLoadingScreen: FC<{}> = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={styles.wrapper}
    >
      <LoadingIcon animate size={40} />
    </Box>
  )
}

export default AuthenticatorLoadingScreen
