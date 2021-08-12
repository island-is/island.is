import React, { ReactNode, useContext, useEffect } from 'react'
import {
  Box,
  GridContainer,
  FormStepper,
  Button,
} from '@island.is/island-ui/core'

import { useRouter } from 'next/router'

const Login: React.FC = () => {
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
        Plat notandi
      </Button>
    </GridContainer>
  )
}

export default Login
