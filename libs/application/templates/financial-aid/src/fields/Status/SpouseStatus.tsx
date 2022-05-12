import React from 'react'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../lib/types'
import {
  Header,
  MissingFilesCard,
  MoreActions,
  SpouseApproved,
  Timeline,
} from './index'
import useApplication from '../../lib/hooks/useApplication'
import * as styles from './Status.css'

const SpouseStatus = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { currentApplication } = useApplication(
    application.externalData.veita.data.currentApplicationId,
  )
  const { nationalRegistry } = application.externalData
  const state = currentApplication?.state

  return (
    <Box paddingBottom={5} className={styles.container}>
      <Header state={state} />

      {state === ApplicationState.APPROVED && <SpouseApproved />}

      {state === ApplicationState.DATANEEDED && (
        <MissingFilesCard
          onClick={() => goToScreen && goToScreen('missingFiles')}
        />
      )}

      <Timeline
        state={state}
        created={
          currentApplication?.created
            ? new Date(currentApplication.created)
            : new Date(application.created)
        }
        modified={
          currentApplication?.modified
            ? new Date(currentApplication.modified)
            : new Date(application.modified)
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

export default SpouseStatus
