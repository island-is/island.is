import React from 'react'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { hasSpouse, waitingForSpouse } from '../../lib/utils'
import useApplication from '../../lib/hooks/useApplication'
import Header from '../../components/Status/Header/Header'
import SpouseAlert from '../../components/Status/SpouseAlert/SpouseAlert'
import ApprovedAlert from '../../components/Status/ApprovedAlert/ApprovedAlert'
import RejectionMessage from '../../components/Status/RejectionMessage/RejectionMessage'
import MissingFilesCard from '../../components/Status/MissingFilesCard/MissingFilesCard'
import AidAmount from '../../components/Status/AidAmount/AidAmount'
import Timeline from '../../components/Status/Timeline/Timeline'
import MoreActions from '../../components/Status/MoreActions/MoreActions'
import { FieldBaseProps } from '@island.is/application/types'
import { getApplicantStatusConstants } from './util'

export const ApplicantStatus = ({
  application,
  goToScreen,
}: FieldBaseProps) => {
  const { answers, externalData } = application
  const { currentApplicationId, showCopyUrl, homepage, email, rulesHomepage } =
    getApplicantStatusConstants(answers, externalData)

  const { currentApplication, loading } = useApplication(currentApplicationId)
  const { municipality } = application.externalData
  const isWaitingForSpouse = waitingForSpouse(application.state)

  const state =
    !currentApplication && isWaitingForSpouse
      ? ApplicationState.NEW
      : currentApplication?.state

  if (loading) {
    return <LoadingDots />
  }

  return (
    <Box paddingBottom={5}>
      <Header state={state} />
      {isWaitingForSpouse && <SpouseAlert showCopyUrl={showCopyUrl ?? false} />}
      {state === ApplicationState.APPROVED && (
        <ApprovedAlert events={currentApplication?.applicationEvents} />
      )}
      {state === ApplicationState.REJECTED && (
        <RejectionMessage
          rejectionComment={currentApplication?.rejection}
          rulesPage={rulesHomepage}
          homepage={homepage}
          email={email}
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
          municipality={municipality}
          amount={currentApplication?.amount}
        />
      )}
      <Timeline
        state={state}
        created={currentApplication?.created ?? application.created}
        modified={currentApplication?.modified ?? application.modified}
        showSpouseStep={
          isWaitingForSpouse
            ? hasSpouse(answers, externalData)
            : currentApplication?.spouseNationalId != null
        }
      />
      <MoreActions
        municipalityRulesPage={rulesHomepage}
        municipalityEmail={email}
      />
    </Box>
  )
}
