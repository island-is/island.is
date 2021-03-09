import React, { useContext, useEffect } from 'react'
import { Text, Button, Box, AlertMessage } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { LoginErrorCodes } from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import * as styles from './Login.treat'

const Login = () => {
  const router = useRouter()
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

  const getErrorAlert = (errorCode: LoginErrorCodes): JSX.Element | null => {
    switch (errorCode) {
      case LoginErrorCodes.LOGIN_FAILED:
        return (
          <AlertMessage
            type="warning"
            title="Innskráning ógild"
            message="Innskráning tókst ekki. Ertu viss um að þú hafir slegið inn rétt símanúmer?"
          />
        )
      case LoginErrorCodes.UNAUTHENTICATED:
        return (
          <AlertMessage
            type="info"
            title="Innskráning tókst ekki"
            message="Innskráning ekki lengur gild. Vinsamlegast reynið aftur."
          />
        )
      case LoginErrorCodes.UNAUTHORIZED:
        return (
          <AlertMessage
            type="warning"
            title="Þú ert ekki með aðgang"
            message="Þú hefur ekki fengið aðgang að Réttarvörslugátt. Ef þú telur þig eiga að hafa aðgang þarft þú að hafa samband við viðeigandi stjórnanda eða notendaþjónustu hjá þinni starfsstöð."
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.loginContainer}>
      {router.query.villa && (
        <div className={styles.errorMessage}>
          <Box marginBottom={6}>
            {getErrorAlert(router.query.villa as LoginErrorCodes)}
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
          href={`${api.apiUrl}/api/auth/login?returnUrl=/krofur`}
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
