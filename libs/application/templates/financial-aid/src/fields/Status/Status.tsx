import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import { FAFieldBaseProps } from '../../lib/types'
import MoreActions from './MoreActions'
import Timeline from './Timeline/Timeline'

const Status = ({ application }: FAFieldBaseProps) => {
  const { nationalRegistry } = application.externalData

  return (
    <>
      {/* TODO: use correct state and we might need to use the dates from Veita*/}
      <Timeline
        state={ApplicationState.APPROVED}
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
