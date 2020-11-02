import React, { FC } from 'react'
import { Box, Text, Stack, LoadingIcon } from '@island.is/island-ui/core'
import * as styles from './Authenticator.treat'

const AuthenticatorLoadingScreen: FC<{}> = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={styles.wrapper}
    >
      <Stack space={3} align="center">
        <LoadingIcon animate size={40} />
        <Text variant="h4" color="blue600">
          Unnið úr auðkenningu
        </Text>
      </Stack>
    </Box>
  )
}

export default AuthenticatorLoadingScreen
