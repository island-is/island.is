import React from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import { Typography, Input, Button, Box } from '@island.is/island-ui/core'
import { apiUrl } from '../../api'
import * as styles from './Login.treat'

export const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div className={styles.titleContainer}>
        <Box>
          <Typography as="h1" variant="h1">
            Skráðu þig inn í Réttarvörslugátt
          </Typography>
        </Box>
      </div>
      <div className={styles.subTitleContainer}>
        <Typography>
          Notaðu rafræn skilríki til þess að skrá þig inn. Passaðu upp á að það
          sé kveikt á símanum eða hann sé ólæstur.
        </Typography>
      </div>
      <div className={styles.inputContainer}>
        <Input
          name="phoneNr"
          placeholder="7 stafa símanúmer"
          label="Símanúmer"
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button
          href={`${apiUrl}/api/auth/login?returnUrl=gaesluvardhaldskrofur`}
          width="fluid"
        >
          Innskráning
        </Button>
      </div>
    </div>
  )
}

export default Login
