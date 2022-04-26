import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { FAFieldBaseProps } from '../../lib/types'
import Status from './Status'

const SpouseStatus = ({ application }: FAFieldBaseProps) => {
  return (
    <Status
      application={application}
      showFilesCard={
        application.applicationState === ApplicationState.DATANEEDED
      }
    />
  )
}

export default SpouseStatus
