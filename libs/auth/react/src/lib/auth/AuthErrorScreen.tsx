import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './Auth.css'

type AuthenticatorErrorScreenProps = {
  basePath: string
  error: Error
}

// This screen is unfortunately not translated because at this point we don't
// have a user locale, nor an access token to fetch translations.
export const AuthErrorScreen = ({
  basePath,
  error,
}: AuthenticatorErrorScreenProps) => {
  const onTryAgainHandler = () => {
    window.location.href = basePath
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={[0, 6]}
      className={styles.fullScreen}
    >
      <Problem
        expand
        error={error}
        logError={false}
        tag="Villa"
        title="Innskráning mistókst"
        message=""
        buttonLink={{
          text: 'Reyna aftur',
          onClick: onTryAgainHandler,
        }}
      />
    </Box>
  )
}
