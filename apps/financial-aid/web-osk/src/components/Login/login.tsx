import React from 'react'
import { GridContainer, Button, Text, Box } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import * as styles from './login.treat'

interface Props {
  headline?: string
  about?: string
}

const Login = ({ headline, about }: Props) => {
  const router = useRouter()

  const apiLoginRouteForFake = router.query.id
    ? `/api/auth/login?applicationId=${router.query.id}&nationalId=`
    : '/api/auth/login?'

  const apiLoginRouteForRealUsers = router.query.id
    ? `/api/auth/login?applicationId=${router.query.id}`
    : '/api/auth/login'

  return (
    <GridContainer>
      <div className={styles.gridRowContainer}>
        <Box className={styles.loginContainer}>
          <Text as="h1" variant="h1" marginBottom={2} marginTop={10}>
            {headline}
          </Text>

          <Text marginBottom={3}>{about}</Text>

          <Button
            onClick={() => {
              router.push(apiLoginRouteForRealUsers)
            }}
            data-testid="logout-button"
            preTextIconType="filled"
            type="button"
            variant="primary"
          >
            Innskráning
          </Button>
          <br />
          <br />
          <Button
            onClick={() => {
              router.push(`${apiLoginRouteForFake}0000000000`)
            }}
            data-testid="logout-button"
            preTextIconType="filled"
            type="button"
            variant="primary"
          >
            Plat notandi (Árnason)
          </Button>
          <br />
          <br />
          <Button
            onClick={() => {
              router.push(`${apiLoginRouteForFake}0000000001`)
            }}
            data-testid="logout-button"
            preTextIconType="filled"
            type="button"
            variant="primary"
          >
            Plat notandi (Margrétdóttir)
          </Button>
        </Box>
      </div>
    </GridContainer>
  )
}

export default Login
