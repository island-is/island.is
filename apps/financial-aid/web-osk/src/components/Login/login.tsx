import React from 'react'
import { GridContainer, Button, Text } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'

interface Props {
  headline?: string
  about?: string
}

const Login = ({ headline, about }: Props) => {
  const router = useRouter()

  const apiLoginRoute = '/api/auth/login'

  return (
    <GridContainer>
      <Text as="h1" variant="h2" marginBottom={2} marginTop={10}>
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
          router.push(`${apiLoginRoute}?nationalId=0000000000`)
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
          router.push(`${apiLoginRoute}?nationalId=0000000001`)
        }}
        data-testid="logout-button"
        preTextIconType="filled"
        type="button"
        variant="primary"
      >
        Plat notandi (Margrétdóttir)
      </Button>
    </GridContainer>
  )
}

export default Login
