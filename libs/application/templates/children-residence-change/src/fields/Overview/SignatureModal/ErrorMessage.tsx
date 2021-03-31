import React from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import { Box, AlertMessage, Button } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'

interface ErrorMessageProps {
  onClose: () => void
  errorCode?: number
}

// TODO: handle errors better when we have the support from the backend
const ErrorMessage = ({ onClose, errorCode }: ErrorMessageProps) => {
  const { formatMessage } = useIntl()

  const message = (() => {
    switch (errorCode) {
      case 404:
        return signatureModal.error.noElectronicId
      case 400:
        return signatureModal.error.userCancelled
      case 409:
        return signatureModal.error.timeOut
      default:
        return signatureModal.defaultError.message
    }
  })()

  return (
    <>
      <AlertMessage
        type="error"
        title={formatMessage(signatureModal.defaultError.title)}
        message={formatMessage(message)}
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
