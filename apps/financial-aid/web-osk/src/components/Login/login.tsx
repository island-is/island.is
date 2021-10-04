import React, { useEffect } from 'react'
import { GridContainer, Button, Text, Box } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import * as styles from './login.treat'
import {
  identityServerId,
  Routes,
  signOutUrl,
} from '@island.is/financial-aid/shared/lib'
import { signIn, useSession, signOut } from 'next-auth/client'

interface Props {
  headline?: string
  about?: string
}

const Login = ({ headline, about }: Props) => {
  useEffect(() => {
    console.log('window', window?.location?.origin)
  })

  return (
    <GridContainer>
      <div className={styles.gridRowContainer}>
        <Box className={styles.loginContainer}>
          <Text as="h1" variant="h1" marginBottom={2} marginTop={10}>
            {headline}
          </Text>
          <Text marginBottom={3}>{about}</Text>

          <Button
            onClick={() =>
              signIn(identityServerId, {
                callbackUrl: `${window.location.origin}/umsokn`,
              })
            }
            data-testid="logout-button"
            preTextIconType="filled"
            type="button"
            variant="primary"
          >
            Innskráning
          </Button>
        </Box>
      </div>
    </GridContainer>
  )
}

export default Login
