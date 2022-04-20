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
      {/* TODO: add checks when do display aid amount*/}
      <AidAmount
        application={application}
        type={
          application.state === ApplicationState.APPROVED
            ? 'breakdown'
            : 'estimation'
        }
        amount={{
          aidAmount: 10000,
          personalTaxCredit: 2000,
          tax: 1000,
          finalAmount: 20000,
        }}
      />

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
