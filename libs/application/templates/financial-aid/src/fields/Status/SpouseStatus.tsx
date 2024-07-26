import React from 'react'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import useApplication from '../../lib/hooks/useApplication'
import * as styles from './Status.css'
import Header from '../../components/Status/Header/Header'
import SpouseApproved from '../../components/Status/SpouseApproved/SpouseApproved'
import MissingFilesCard from '../../components/Status/MissingFilesCard/MissingFilesCard'
import Timeline from '../../components/Status/Timeline/Timeline'
import MoreActions from '../../components/Status/MoreActions/MoreActions'

const SpouseStatus = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { currentApplication, loading } = useApplication(
    application.externalData.currentApplication.data?.currentApplicationId,
  )
  const { municipality } = application.externalData
  const state = currentApplication?.state

  if (loading) {
    return <LoadingDots />
  }

  return (
    <Box paddingBottom={5} className={styles.container}>
      <Header state={state} />

      {state === ApplicationState.APPROVED && <SpouseApproved />}

      {state === ApplicationState.DATANEEDED && (
        <MissingFilesCard goToScreen={goToScreen} />
      )}

      <Timeline
        state={state}
        created={currentApplication?.created ?? application.created}
        modified={currentApplication?.modified ?? application.modified}
      />

      <MoreActions
        municipalityRulesPage={municipality.data?.rulesHomepage}
        municipalityEmail={municipality.data?.email}
      />
    </Box>
  )
}

export default SpouseStatus
