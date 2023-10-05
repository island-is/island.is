import React from 'react'
import { Box, Button, ProblemTemplate } from '@island.is/island-ui/core'

import * as styles from './Auth.css'

type AuthenticatorErrorScreenProps = {
  /**
   * Retry callback
   */
  onRetry(): void
}

// This screen is unfortunately not translated because at this point we don't
// have a user locale, nor an access token to fetch translations.
export const AuthErrorScreen = ({ onRetry }: AuthenticatorErrorScreenProps) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    padding={[0, 6]}
    className={styles.fullScreen}
  >
    <ProblemTemplate
      variant="error"
      expand
      tag="Villa"
      title="Innskráning mistókst"
      message={
        <>
          Vinsamlegast reyndu aftur síðar.{' '}
          <Button variant="text" onClick={onRetry}>
            Reyna aftur
          </Button>
        </>
      }
    />
  </Box>
)
