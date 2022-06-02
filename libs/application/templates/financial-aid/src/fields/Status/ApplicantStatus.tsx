import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../lib/types'
import { hasSpouse, waitingForSpouse } from '../../lib/utils'
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
import * as styles from './Status.css'

const ApplicantStatus = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { currentApplication } = useApplication(
    application.externalData.veita.data.currentApplicationId,
  )
  const { nationalRegistry } = application.externalData
  const isWaitingForSpouse = waitingForSpouse(application.state)

  const state =
    !currentApplication && isWaitingForSpouse
      ? ApplicationState.NEW
      : currentApplication?.state

  return (
    <Box paddingBottom={5} className={styles.container}>
      <Header state={state} />

      {isWaitingForSpouse && (
        <SpouseAlert showCopyUrl={!application.answers.spouseEmailSuccess} />
      )}

      {state === ApplicationState.REJECTED && (
        <RejectionMessage
          rejectionComment={currentApplication?.rejection}
          rulesPage={nationalRegistry?.data?.municipality?.rulesHomepage}
          homepage={nationalRegistry?.data?.municipality?.homepage}
          email={nationalRegistry?.data?.municipality?.email}
        />
      )}

      {state === ApplicationState.DATANEEDED && (
        <MissingFilesCard goToScreen={goToScreen} />
      )}

      {state !== ApplicationState.REJECTED && (
        <AidAmount
          application={application}
          veitaApplication={currentApplication}
          state={state}
          nationalRegistry={application.externalData.nationalRegistry}
          amount={currentApplication?.amount}
        />
      )}

      <Timeline
        state={state}
        created={currentApplication?.created ?? application.created}
        modified={currentApplication?.modified ?? application.modified}
        showSpouseStep={
          isWaitingForSpouse
            ? hasSpouse(application.answers, application.externalData)
            : currentApplication?.spouseNationalId != null
        }
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
