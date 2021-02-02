import React, { useContext, useEffect } from 'react'
import { Text, Button, Box, AlertMessage } from '@island.is/island-ui/core'
import * as styles from './Login.treat'
import { api } from '@island.is/judicial-system-web/src/services'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

export const Login = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const { user } = useContext(UserContext)

  useEffect(() => {
    document.title = 'Réttarvörslugátt'
  }, [])

  useEffect(() => {
    /**
     * When users go to the login screen we want to make sure
     * that any logged in user is logged out.
     */
    if (user) {
      api.logOut()
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
        <a
          href={`${api.apiUrl}/api/auth/login?returnUrl=/gaesluvardhaldskrofur`}
          role="button"
          rel="noreferrer noopener"
          className={styles.btn}
        >
          <Button fluid>Innskráning</Button>
        </a>
      </div>
    </div>
  )
}

export default Login
