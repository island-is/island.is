import React from 'react'
import { Box, Stack, Text, Button } from '@island.is/island-ui/core'
import * as styles from './Auth.css'

type AuthenticatorErrorScreenProps = {
  basePath: string
}

// This screen is unfortunately not translated because at this point we don't
// have a user locale, nor an access token to fetch translations.
export const AuthErrorScreen = ({
  basePath,
}: AuthenticatorErrorScreenProps) => {
  const onTryAgainHandler = () => {
    window.location.href = basePath
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={styles.fullScreen}
    >
      <Stack space={2} align="center">
        <Text as="h1" variant="h2">
          Óvænt villa
        </Text>
        <Text variant="intro">Innskráning mistókst.</Text>
        <Button variant="primary" onClick={onTryAgainHandler}>
          Reyna aftur
        </Button>
      </Stack>
    </Box>
  )
}
