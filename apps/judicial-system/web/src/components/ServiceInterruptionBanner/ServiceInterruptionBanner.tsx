import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertBanner } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'

import { UserContext } from '../UserProvider/UserProvider'

const ServiceInterruptionBanner: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
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
    isProsecutionUser(user) &&
    prosecutorMessage &&
    prosecutorMessage !== 'NONE'
  ) {
    displayMessage = prosecutorMessage
  } else if (
    isDistrictCourtUser(user) &&
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
