import React from 'react'

import { coreMessages } from '@island.is/application/core'
import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const ErrorMessage = () => {
  const { formatMessage } = useLocale()

  return (
    <AlertMessage
      type="error"
      title={formatMessage(coreMessages.globalErrorTitle)}
      message={formatMessage(coreMessages.globalErrorMessage)}
    />
  )
}
