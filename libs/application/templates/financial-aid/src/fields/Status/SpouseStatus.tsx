import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import { FAFieldBaseProps } from '../../lib/types'
import Status from './Status'

const SpouseStatus = ({ application }: FAFieldBaseProps) => {
  return (
    <Status
      application={application}
      showSpouseApproved={application.externalData?.veita?.data?.state === ApplicationState.APPROVED}
    />
  )
}

export default SpouseStatus
