import React from 'react'
import { GridContainer, Button, Text, Box } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import * as styles from './login.treat'

interface Props {
  headline?: string
  about?: string
  statusPage?: boolean
}

const Login = ({ headline, about, statusPage = false }: Props) => {
  const router = useRouter()

  const apiLoginRoute = statusPage
    ? `/api/auth/login?applicationId=${router.query.id}&nationalId=`
    : '/api/auth/login?nationalId='

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
              router.push(apiLoginRoute)
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
              router.push(`${apiLoginRoute}0000000000`)
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
              router.push(`${apiLoginRoute}0000000001`)
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
