import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import { FAFieldBaseProps } from '../../lib/types'
import Status from './Status'

const ApplicantStatus = ({ application }: FAFieldBaseProps) => {
  return (
    <Status
      application={application}
      showAidAmount={application.applicationState !== ApplicationState.REJECTED}
    />
  )
}

export default ApplicantStatus
