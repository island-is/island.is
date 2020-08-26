import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

const AuthenticatorLoadingScreen: FC<{}> = () => {
  return (
    <Box display="flex" justifyContent="center" margin={12}>
      <Typography variant="h2">Augnablik</Typography>
    </Box>
  )
}

export default AuthenticatorLoadingScreen
