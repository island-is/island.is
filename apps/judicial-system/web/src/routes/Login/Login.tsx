import React, { useContext, useEffect } from 'react'
import {
  Text,
  ButtonDeprecated as Button,
  Box,
  AlertMessage,
} from '@island.is/island-ui/core'
import * as styles from './Login.treat'
import { api } from '../../services'
import { UserContext } from '../../shared-components/UserProvider/UserProvider'

export const Login = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const { user } = useContext(UserContext)

  useEffect(() => {
    document.title = 'Réttarvörslugátt'
    window.localStorage.clear()
  }, [])

  useEffect(() => {
    const logoutCurrentUser = async () => {
      console.log(user)
      api.logOut()
    }
    if (user) {
      logoutCurrentUser()
    }
  }, [user])

  return (
    <div className={styles.loginContainer}>
      {urlParams.has('error') && (
        <div className={styles.errorMessage}>
          <Box marginBottom={6}>
            <AlertMessage
              type="info"
              title="Innskráning ógild"
              message="Innskráning ekki lengur gild. Vinsamlegast reynið aftur."
            />
          </Box>
        </div>
      )}
      <div className={styles.titleContainer}>
        <Box>
          <Text as="h1" variant="h1">
            Skráðu þig inn í Réttarvörslugátt
          </Text>
        </Box>
      </div>
      <div className={styles.subTitleContainer}>
        <Text>
          Notaðu rafræn skilríki til þess að skrá þig inn. Passaðu upp á að það
          sé kveikt á símanum eða hann sé ólæstur.
        </Text>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          href={`${api.apiUrl}/api/auth/login?returnUrl=/gaesluvardhaldskrofur`}
          width="fluid"
        >
          Innskráning
        </Button>
      </div>
    </div>
  )
}

export default Login
