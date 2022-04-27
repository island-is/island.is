import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import { FAFieldBaseProps } from '../../lib/types'
import Status from './Status'

const ApplicantStatus = ({ application }: FAFieldBaseProps) => {
  const state = application.externalData?.veita?.data?.state

  return (
    <Status
      application={application}
      showAidAmount={state !== ApplicationState.REJECTED}
      showRejectionMessage={state === ApplicationState.REJECTED}
    />
  )
}

export default ApplicantStatus
