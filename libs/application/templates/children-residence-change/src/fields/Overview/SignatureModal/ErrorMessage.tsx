import React from 'react'
import { useIntl } from 'react-intl'
import { Box, AlertMessage, Button } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'

const errorMessages = {
  404: signatureModal.error.noElectronicId,
  400: signatureModal.error.userCancelled,
  409: signatureModal.error.timeOut,
  500: signatureModal.defaultError.message,
}

const warningCodes = [409, 400]

interface ErrorMessageProps {
  onClose: () => void
  errorCode: number
}

const ErrorMessage = ({ onClose, errorCode }: ErrorMessageProps) => {
  const { formatMessage } = useIntl()
  const errorMessageKey =
    errorCode in errorMessages ? (errorCode as keyof typeof errorMessages) : 500
  return (
    <>
      <AlertMessage
        type={warningCodes.includes(errorMessageKey) ? 'warning' : 'error'}
        title={formatMessage(signatureModal.defaultError.title)}
        message={formatMessage(errorMessages[errorMessageKey])}
      />
      <Box marginTop={3} justifyContent="center">
        <Button onClick={onClose} variant="primary">
          {formatMessage(signatureModal.general.closeButtonLabel)}
        </Button>
      </Box>
    </>
  )
}

export default ErrorMessage
