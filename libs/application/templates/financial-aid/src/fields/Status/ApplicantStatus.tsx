import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box, LoadingDots } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../lib/types'
import { hasSpouse, waitingForSpouse } from '../../lib/utils'
import useApplication from '../../lib/hooks/useApplication'
import * as styles from './Status.css'
import Header from '../../components/Status/Header/Header'
import SpouseAlert from '../../components/Status/SpouseAlert/SpouseAlert'
import ApprovedAlert from '../../components/Status/ApprovedAlert/ApprovedAlert'
import RejectionMessage from '../../components/Status/RejectionMessage/RejectionMessage'
import MissingFilesCard from '../../components/Status/MissingFilesCard/MissingFilesCard'
import AidAmount from '../../components/Status/AidAmount/AidAmount'
import Timeline from '../../components/Status/Timeline/Timeline'
import MoreActions from '../../components/Status/MoreActions/MoreActions'

const ApplicantStatus = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { currentApplication, loading } = useApplication(
    application.externalData.currentApplication.data?.currentApplicationId,
  )
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
    <Box paddingBottom={5} className={styles.container}>
      <Header state={state} />
      {isWaitingForSpouse && (
        <SpouseAlert
          showCopyUrl={!application.externalData.sendSpouseEmail?.data.success}
        />
      )}
      {state === ApplicationState.APPROVED && (
        <ApprovedAlert events={currentApplication?.applicationEvents} />
      )}
      {state === ApplicationState.REJECTED && (
        <RejectionMessage
          rejectionComment={currentApplication?.rejection}
          rulesPage={municipality.data?.rulesHomepage}
          homepage={municipality.data?.homepage}
          email={municipality.data?.email}
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
            ? hasSpouse(application.answers, application.externalData)
            : currentApplication?.spouseNationalId != null
        }
      />
      <MoreActions
        municipalityRulesPage={municipality.data?.rulesHomepage}
        municipalityEmail={municipality.data?.email}
      />
    </Box>
  )
}

export default ApplicantStatus
