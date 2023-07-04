import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { core } from '@island.is/judicial-system-web/messages'
import { AlertBanner } from '@island.is/island-ui/core'
import {
  isProsecutionRole,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'

import { UserContext } from '../UserProvider/UserProvider'

const ServiceInterruptionBanner: React.FC = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  let displayMessage = ''
  const message = formatMessage(core.serviceInterruptionText)
  const prosecutorMessage = formatMessage(
    core.serviceInterruptionTextProsecutor,
  )
  const courtMessage = formatMessage(core.serviceInterruptionTextCourt)

  if (message && message !== 'NONE') {
    displayMessage = message
  } else if (
    user?.role &&
    isProsecutionRole(user.role) &&
    prosecutorMessage &&
    prosecutorMessage !== 'NONE'
  ) {
    displayMessage = prosecutorMessage
  } else if (
    user?.role &&
    isExtendedCourtRole(user.role) &&
    courtMessage &&
    courtMessage !== 'NONE'
  ) {
    displayMessage = courtMessage
  } else {
    return null
  }

  return (
    <AlertBanner
      title={formatMessage(core.serviceInterruptionTitle)}
      variant="warning"
      description={displayMessage}
      dismissable
    />
  )
}

export default ServiceInterruptionBanner
