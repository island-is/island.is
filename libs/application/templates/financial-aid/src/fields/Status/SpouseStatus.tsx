import React from 'react'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box, LoadingDots } from '@island.is/island-ui/core'
import useApplication from '../../lib/hooks/useApplication'
import Header from '../../components/Status/Header/Header'
import SpouseApproved from '../../components/Status/SpouseApproved/SpouseApproved'
import MissingFilesCard from '../../components/Status/MissingFilesCard/MissingFilesCard'
import Timeline from '../../components/Status/Timeline/Timeline'
import MoreActions from '../../components/Status/MoreActions/MoreActions'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

const SpouseStatus = ({ application, goToScreen }: FieldBaseProps) => {
  const { answers, externalData } = application
  const currentApplicationId = getValueViaPath(
    answers,
    'externalData.currentApplication.data.currentApplicationId',
  ) as string | undefined
  const rulesHomepage = getValueViaPath(
    externalData,
    'municipality.data.rulesHomepage',
  ) as string | undefined
  const email = getValueViaPath(externalData, 'municipality.data.email') as
    | string
    | undefined

  const { currentApplication, loading } = useApplication(currentApplicationId)
  const state = currentApplication?.state

  if (loading) {
    return <LoadingDots />
  }

  return (
    <Box paddingBottom={5}>
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
        municipalityRulesPage={rulesHomepage}
        municipalityEmail={email}
      />
    </Box>
  )
}

export default SpouseStatus
