import React from 'react'
import { GridContainer, Button } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()

  return (
    <GridContainer>
      <Button
        onClick={() => {
          router.push('/api/auth/login')
        }}
        data-testid="logout-button"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="primary"
      >
        Innskráning
      </Button>
      <br />
      <br />
      <Button
        onClick={() => {
          router.push('/api/auth/login?nationalId=0000000000')
        }}
        data-testid="logout-button"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="primary"
      >
        Plat notandi (Árnason)
      </Button>
      <br />
      <br />
      <Button
        onClick={() => {
          router.push('/api/auth/login?nationalId=0000000001')
        }}
        data-testid="logout-button"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="primary"
      >
        Plat notandi (Margrétdóttir)
      </Button>
    </GridContainer>
  )
}

export default Login
