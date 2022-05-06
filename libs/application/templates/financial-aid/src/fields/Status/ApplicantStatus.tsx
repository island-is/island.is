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
import useApplication from '../../lib/hooks/useApplication'

const ApplicantStatus = ({ application }: FAFieldBaseProps) => {
  const { currentApplication } = useApplication(
    application.externalData.veita.data.currentApplicationId,
  )
  const { nationalRegistry } = application.externalData
  const state =
    !currentApplication && application.state === ApplicationStates.SPOUSE
      ? ApplicationState.NEW
      : currentApplication?.state

  return (
    <Box paddingBottom={5}>
      <Header state={state} />

      {application.state === ApplicationStates.SPOUSE && <SpouseAlert />}

      {state === ApplicationState.REJECTED && (
        <RejectionMessage
          rejectionComment={currentApplication?.rejection}
          rulesPage={nationalRegistry?.data?.municipality?.rulesHomepage}
          homepage={nationalRegistry?.data?.municipality?.homepage}
          email={nationalRegistry?.data?.municipality?.email}
        />
      )}

      {/* TODO: redirect user to page to upload files when button is clicked insied of MissingFilesCard*/}
      {state === ApplicationState.DATANEEDED && <MissingFilesCard />}

      {state !== ApplicationState.REJECTED && (
        <AidAmount
          application={application}
          state={state}
          amount={currentApplication?.amount}
        />
      )}

      <Timeline
        state={state}
        created={
          currentApplication?.created
            ? new Date(currentApplication.created)
            : application.created
        }
        modified={
          currentApplication?.modified
            ? new Date(currentApplication.modified)
            : application.modified
        }
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
