import React from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { login, titles } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { api } from '@island.is/judicial-system-web/src/services'
import { login as performLogin } from '@island.is/judicial-system-web/src/services/api'
import { LoginErrorCodes } from '@island.is/judicial-system-web/src/types'

import * as styles from './Login.css'

const Login = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const getErrorAlert = (errorCode: LoginErrorCodes): JSX.Element | null => {
    switch (errorCode) {
      case LoginErrorCodes.LOGIN_FAILED:
        return (
          <AlertMessage
            type="warning"
            title={formatMessage(login.error.failed.title)}
            message={formatMessage(login.error.failed.message)}
          />
        )
      case LoginErrorCodes.UNAUTHENTICATED:
        return (
          <AlertMessage
            type="info"
            title={formatMessage(login.error.unAuthenticated.title)}
            message={formatMessage(login.error.unAuthenticated.message)}
          />
        )
      case LoginErrorCodes.UNAUTHORIZED:
        return (
          <AlertMessage
            type="warning"
            title={formatMessage(login.error.unAuthorized.title)}
            message={formatMessage(login.error.unAuthorized.message)}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      <PageHeader title={formatMessage(titles.shared.login)} />
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
              {formatMessage(login.general.heading)}
            </Text>
          </Box>
        </div>
        <div className={styles.subTitleContainer}>
          <Text>{formatMessage(login.general.description)}</Text>
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={performLogin} fluid>
            {formatMessage(login.general.buttonLabel)}
          </Button>
        </div>
      </div>
    </>
  )
}

export default Login
