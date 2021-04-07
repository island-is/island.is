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
): {
  title: MessageDescriptor
  message: MessageDescriptor
  type: AlertMessageType
} => {
  switch (errorCode) {
    case 400:
      return {
        title: signatureModal.userCancelledWarning.title,
        message: signatureModal.userCancelledWarning.message,
        type: 'warning',
      }
    case 404: {
      return {
        title: signatureModal.noElectronicIdError.title,
        message: signatureModal.noElectronicIdError.message,
        type: 'error',
      }
    }
    case 408: {
      return {
        title: signatureModal.timeOutWarning.title,
        message: signatureModal.timeOutWarning.message,
        type: 'warning',
      }
    }
    default: {
      return {
        title: signatureModal.defaultError.title,
        message: signatureModal.defaultError.message,
        type: 'error',
      }
    }
  }
}

const ErrorMessage = ({ onClose, errorCode }: ErrorMessageProps) => {
  const { formatMessage } = useIntl()
  const errorMessage = errorMessages(errorCode)
  return (
    <>
      <AlertMessage
        type={errorMessage.type}
        title={formatMessage(errorMessage.title)}
        message={formatMessage(errorMessage.message)}
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
