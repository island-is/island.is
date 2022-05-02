import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../lib/types'
import { ApplicationStates } from '../../lib/constants'
import { hasSpouse } from '../../lib/utils'
import {
  AidAmount,
  Header,
  MissingFilesCard,
  MoreActions,
  RejectionMessage,
  SpouseAlert,
  Timeline,
} from './index'

const ApplicantStatus = ({ application }: FAFieldBaseProps) => {
  const { nationalRegistry } = application.externalData
  const state = application.externalData?.veita?.data?.state

  return (
    <Box paddingBottom={5}>
      <Header state={state} />

      {application.state === ApplicationStates.SPOUSE && <SpouseAlert />}

      {/* TODO: use correct rejectionMessage */}
      {state === ApplicationState.REJECTED && (
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
      {state !== ApplicationState.REJECTED && (
        <AidAmount application={application} state={state} />
      )}

      {/* TODO: we might need to use the dates from Veita*/}
      <Timeline
        state={state}
        created={application.created}
        modified={application.modified}
        showSpouseStep={hasSpouse(
          application.answers,
          application.externalData,
        )}
      />

      <MoreActions
        municipalityRulesPage={
          nationalRegistry?.data?.municipality?.rulesHomepage
        }
        municipalityEmail={nationalRegistry?.data?.municipality?.email}
      />
    </Box>
  )
}

export default ApplicantStatus
