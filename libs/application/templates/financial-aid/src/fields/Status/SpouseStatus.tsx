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

const SpouseStatus = ({ application }: FAFieldBaseProps) => {
  const { currentApplication } = useApplication(
    application.externalData.veita.data.currentApplicationId,
  )
  const { nationalRegistry } = application.externalData
  const state = currentApplication?.state

  return (
    <Box paddingBottom={5}>
      <Header state={state} />

      {state === ApplicationState.APPROVED && <SpouseApproved />}

      {/* TODO: redirect user to page to upload files when button is clicked insied of MissingFilesCard*/}
      {state === ApplicationState.DATANEEDED && <MissingFilesCard />}

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
