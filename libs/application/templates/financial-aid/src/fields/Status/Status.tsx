import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'

import { FAApplication } from '../../lib/types'
import {
  AidAmount,
  Header,
  MissingFilesCard,
  MoreActions,
  RejectionMessage,
  SpouseAlert,
  SpouseApproved,
  Timeline,
} from './index'

interface Props {
  application: FAApplication
  showAidAmount?: boolean
  showRejectionMessage?: boolean
  showSpouseAlert?: boolean
  showSpouseTimeline?: boolean
  showSpouseApproved?: boolean
}

const Status = ({
  application,
  showAidAmount,
  showRejectionMessage,
  showSpouseAlert,
  showSpouseTimeline,
  showSpouseApproved,
}: Props) => {
  const { nationalRegistry } = application.externalData
  const state = application.externalData?.veita?.data?.state

  return (
    <Box paddingBottom={5}>
      <Header state={state} />

      {showSpouseAlert && <SpouseAlert />}

      {showSpouseApproved && <SpouseApproved />}

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
        showSpouseStep={showSpouseTimeline}
      />

      <MoreActions
        municipalityRulesPage={
          nationalRegistry?.data.municipality?.rulesHomepage
        }
        municipalityEmail={nationalRegistry?.data.municipality?.email}
      />
    </Box>
  )
}

export default Status
