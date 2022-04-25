import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import { FAFieldBaseProps } from '../../lib/types'
import MoreActions from './MoreActions'
import Timeline from './Timeline/Timeline'
import AidAmount from './AidAmount/AidAmount'

const Status = ({ application }: FAFieldBaseProps) => {
  const { nationalRegistry } = application.externalData

  return (
    <>
      {/* TODO: use correct aid amount inside AidAmount component*/}
      <AidAmount application={application} />

      {/* TODO: we might need to use the dates from Veita*/}
      <Timeline
        state={application.applicationState}
        created={application.created}
        modified={application.modified}
      />

      <MoreActions
        rulesPage={nationalRegistry?.data.municipality?.rulesHomepage}
        email={nationalRegistry?.data.municipality?.email}
      />
    </>
  )
}

export default Status
