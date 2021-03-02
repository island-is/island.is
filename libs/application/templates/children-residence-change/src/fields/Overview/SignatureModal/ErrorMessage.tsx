import React from 'react'
import { useIntl } from 'react-intl'
import { Box, AlertMessage, Button } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'

interface ErrorMessageProps {
  onClose: () => void
}

const ErrorMessage = ({ onClose }: ErrorMessageProps) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <AlertMessage
        type="error"
        title={formatMessage(signatureModal.defaultError.title)}
        message={formatMessage(signatureModal.defaultError.message)}
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
