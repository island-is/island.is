import React from 'react'

import { FAApplication } from '../../lib/types'
import MoreActions from './MoreActions/MoreActions'
import Timeline from './Timeline/Timeline'
import AidAmount from './AidAmount/AidAmount'

interface Props {
  application: FAApplication
  showAidAmount: boolean
}

const Status = ({ application, showAidAmount }: Props) => {
  const { nationalRegistry } = application.externalData

  return (
    <>
      {/* TODO: use correct aid amount inside AidAmount component*/}
      {showAidAmount && <AidAmount application={application} />}

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
