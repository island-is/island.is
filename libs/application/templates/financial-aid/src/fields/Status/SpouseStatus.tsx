import React from 'react'

import { FAFieldBaseProps } from '../../lib/types'
import Status from './Status'

const SpouseStatus = ({ application }: FAFieldBaseProps) => {
  return (
    <Status
      application={application}
      showAidAmount={false}
    />
  )
}

export default SpouseStatus
