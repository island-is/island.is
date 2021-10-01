import React from 'react'
import { GridContainer, Button, Text, Box } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import * as styles from './login.treat'
import { Routes, signOutUrl } from '@island.is/financial-aid/shared/lib'
import { signIn, useSession, signOut } from 'next-auth/client'

interface Props {
  headline?: string
  about?: string
}

const Login = ({ headline, about }: Props) => {
  const router = useRouter()
  const [session] = useSession()

  return (
    <GridContainer>
      <div className={styles.gridRowContainer}>
        <Box className={styles.loginContainer}>
          <Text as="h1" variant="h1" marginBottom={2} marginTop={10}>
            {headline}
          </Text>

          <Text marginBottom={3}>{about}</Text>

          <Button
            onClick={() => signIn('identity-server')}
            data-testid="logout-button"
            preTextIconType="filled"
            type="button"
            variant="primary"
          >
            Innskráning
          </Button>
          {/* TODO: REMOVE THIS BUTTON AFTER TESTING AND MOVE TO CORRECT LOGOUT */}
          <Button
            onClick={() =>
              signOut({
                callbackUrl: signOutUrl(window, session?.idToken),
              })
            }
            data-testid="logout-button"
            preTextIconType="filled"
            type="button"
            variant="primary"
          >
            Skrá út
          </Button>
          <Box paddingTop={4}>
            <Button
              onClick={() => {
                router.push(
                  `${Routes.apiLoginRouteForFake(
                    router.query.id as string,
                  )}0000000000`,
                )
              }}
              data-testid="logout-button"
              preTextIconType="filled"
              type="button"
              variant="primary"
            >
              Plat notandi (Árnason)
            </Button>
          </Box>
          <Box paddingTop={4}>
            <Button
              onClick={() => {
                router.push(
                  `${Routes.apiLoginRouteForFake(
                    router.query.id as string,
                  )}0000000001`,
                )
              }}
              data-testid="logout-button"
              preTextIconType="filled"
              type="button"
              variant="primary"
            >
              Plat notandi (Margrétardóttir)
            </Button>
          </Box>
          <Box paddingTop={4}>
            <Button
              onClick={() => {
                router.push(
                  `${Routes.apiLoginRouteForFake(
                    router.query.id as string,
                  )}0000000003`,
                )
              }}
              data-testid="logout-button"
              preTextIconType="filled"
              type="button"
              variant="primary"
            >
              Plat notandi (Frilluson)
            </Button>
          </Box>
        </Box>
      </div>
    </GridContainer>
  )
}

export default Login
