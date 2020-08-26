import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-fetch'
import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  Input,
  Button,
  Box,
  ContentBlock,
} from '@island.is/island-ui/core'
import * as styles from './Login.treat'

export const Login = () => {
  const [messageFromAPI, setMessageFromAPI] = useState('')

  useEffect(() => {
    let isMounted = true

    async function getData() {
      const rawResponse = await fetch('http://localhost:3333/cases')
      const jsonResponse = await rawResponse.json()

      // Prevent setting state on unmounted component
      if (isMounted) {
        setMessageFromAPI(jsonResponse.length)
      }
    }

    getData()

    return () => {
      isMounted = false
    } // use effect cleanup to set flag false, if unmounted
  })

  return (
    <ContentBlock>
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
            Notaðu rafræn skilríki til þess að skrá þig inn. Passaðu upp á að
            það sé kveikt á símanum eða hann sé ólæstur.
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
          <Button disabled>Innskráning</Button>
        </div>
        {messageFromAPI}
      </div>
    </ContentBlock>
  )
}

export default Login
