import React from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import {
  Box,
  AlertMessage,
  Button,
  AlertMessageType,
} from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'

interface ErrorMessageProps {
  onClose: () => void
  errorCode: number
}

const errorMessages = (
  errorCode: number,
): { message: MessageDescriptor; type: AlertMessageType } => {
  switch (errorCode) {
    case 400:
      return {
        message: signatureModal.error.userCancelled,
        type: 'warning',
      }
    case 404: {
      return {
        message: signatureModal.error.noElectronicId,
        type: 'error',
      }
    }
    case 409: {
      return { message: signatureModal.error.timeOut, type: 'warning' }
    }
    default: {
      return { message: signatureModal.defaultError.message, type: 'error' }
    }
  }
}

const ErrorMessage = ({ onClose, errorCode }: ErrorMessageProps) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <AlertMessage
        type={errorMessages(errorCode).type}
        title={formatMessage(signatureModal.defaultError.title)}
        message={formatMessage(errorMessages(errorCode).message)}
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
