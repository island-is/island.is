import { useRouter } from 'next/router'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  FormContentContainer,
  FormFooter,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import { LoginErrorCodes } from '@island.is/judicial-system-web/src/types'

import { strings } from './Login.string'
import * as styles from './Login.css'

const Login = () => {
  const router = useRouter()

  const getErrorAlert = (errorCode: LoginErrorCodes): JSX.Element | null => {
    switch (errorCode) {
      case LoginErrorCodes.LOGIN_FAILED:
        return (
          <AlertMessage
            type="warning"
            title={strings.error.failed.title}
            message={strings.error.failed.message}
          />
        )
      case LoginErrorCodes.UNAUTHENTICATED:
        return (
          <AlertMessage
            type="info"
            title={strings.error.unAuthenticated.title}
            message={strings.error.unAuthenticated.message}
          />
        )
      case LoginErrorCodes.UNAUTHORIZED:
        return (
          <AlertMessage
            type="warning"
            title={strings.error.unAuthorized.title}
            message={strings.error.unAuthorized.message}
          />
        )
      case LoginErrorCodes.DEPRECATED_LOGIN:
        return (
          <AlertMessage
            type="warning"
            title={strings.error.deprecatedLogin.title}
            message={strings.error.deprecatedLogin.message}
          />
        )
      case LoginErrorCodes.INVALID_USER:
        return (
          <AlertMessage
            type="warning"
            title={strings.error.invalidUser.title}
            message={strings.error.invalidUser.message}
          />
        )
      case LoginErrorCodes.LOGIN_ERROR:
        return (
          <AlertMessage
            type="warning"
            title={strings.error.loginError.title}
            message={strings.error.loginError.message}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <FormContentContainer>
        {router.query.villa && (
          <Box className={styles.errorMessage} marginBottom={6}>
            {getErrorAlert(router.query.villa as LoginErrorCodes)}
          </Box>
        )}
        <Box
          className={styles.titleContainer}
          marginTop={router.query.villa ? 0 : 10}
        >
          <PageTitle marginBottom={0}>{strings.general.heading}</PageTitle>
        </Box>
        <Box className={styles.subTitleContainer}>
          <Text>{strings.general.description}</Text>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          hidePreviousButton
          nextButtonText={strings.general.buttonLabel}
          onNextButtonClick={() => router.push('/api/auth/login')}
        />
      </FormContentContainer>
    </>
  )
}

export default Login
