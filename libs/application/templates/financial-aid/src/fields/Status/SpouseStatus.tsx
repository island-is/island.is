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

const SpouseStatus = ({ application }: FAFieldBaseProps) => {
  const { nationalRegistry } = application.externalData
  const state = application.externalData?.veita?.data?.state

  return (
    <Box paddingBottom={5}>
      <Header state={state} />

      {application.externalData?.veita?.data?.state ===
        ApplicationState.APPROVED && <SpouseApproved />}

      {/* TODO: redirect user to page to upload files when button is clicked insied of MissingFilesCard*/}
      {state === ApplicationState.DATANEEDED && <MissingFilesCard />}

      {/* TODO: we might need to use the dates from Veita*/}
      <Timeline
        state={state}
        created={application.created}
        modified={application.modified}
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
