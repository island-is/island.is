import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import { FAApplication } from '../../lib/types'
import MoreActions from './MoreActions/MoreActions'
import Timeline from './Timeline/Timeline'
import AidAmount from './AidAmount/AidAmount'
import MissingFilesCard from './MissingFIlesCard/MissingFilesCard'
import Header from './Header/Header'
import RejectionMessage from './RejectionMessage/RejectionMessage'
import SpouseAlert from './SpouseAlert/SpouseAlert'

interface Props {
  application: FAApplication
  showAidAmount?: boolean
  showRejectionMessage?: boolean
  showSpouseAlert?: boolean
}

const Status = ({
  application,
  showAidAmount,
  showRejectionMessage,
  showSpouseAlert,
}: Props) => {
  const { nationalRegistry } = application.externalData
  const state = application.externalData?.veita?.data?.state

  return (
    <>
      <Header state={state} />

      {showSpouseAlert && <SpouseAlert />}

      {/* TODO: use correct rejectionMessage */}
      {showRejectionMessage && (
        <RejectionMessage
          rejectionComment="hóhóhóhó"
          rulesPage={nationalRegistry?.data?.municipality?.rulesHomepage}
          homepage={nationalRegistry?.data?.municipality?.homepage}
          email={nationalRegistry?.data?.municipality?.email}
        />
      )}

      {/* TODO: redirect user to page to upload files when button is clicked insied of MissingFilesCard*/}
      {state === ApplicationState.DATANEEDED && <MissingFilesCard />}

      {/* TODO: use correct aid amount inside AidAmount component*/}
      {showAidAmount && <AidAmount application={application} state={state} />}

      {/* TODO: we might need to use the dates from Veita*/}
      <Timeline
        state={state}
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
