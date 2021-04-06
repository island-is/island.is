import React, { useState, useEffect } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import { Box, AlertMessage, Button } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'

interface ErrorMessageProps {
  onClose: () => void
  errorCode?: number
}

const ErrorMessage = ({ onClose, errorCode }: ErrorMessageProps) => {
  const { formatMessage } = useIntl()
  const [errorMessage, setErrorMessage] = useState<MessageDescriptor>(
    signatureModal.defaultError.message,
  )

  useEffect(() => {
    switch (errorCode) {
      case 404:
        setErrorMessage(signatureModal.error.noElectronicId)
        break
      case 400:
        setErrorMessage(signatureModal.error.userCancelled)
        break
      case 409:
        setErrorMessage(signatureModal.error.timeOut)
        break
      default:
        setErrorMessage(signatureModal.defaultError.message)
    }
  }, [errorCode])

  return (
    <>
      <AlertMessage
        type="error"
        title={formatMessage(signatureModal.defaultError.title)}
        message={formatMessage(errorMessage)}
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
