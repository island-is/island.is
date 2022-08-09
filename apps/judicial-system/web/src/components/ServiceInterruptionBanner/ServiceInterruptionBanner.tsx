import React from 'react'
import { useIntl } from 'react-intl'
import { core } from '@island.is/judicial-system-web/messages'
import { AlertBanner } from '@island.is/island-ui/core'

const ServiceInterruptionBanner: React.FC = () => {
  const { formatMessage } = useIntl()

  const message = formatMessage(core.serviceInterruptionText, undefined)

  if (!message || message === 'NONE') {
    return null
  }

  return (
    <AlertBanner
      title={formatMessage(core.serviceInterruptionTitle)}
      variant="warning"
      description={message}
      dismissable
    />
  )
}

export default ServiceInterruptionBanner
