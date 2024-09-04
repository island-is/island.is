import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
} from '@island.is/service-portal/core'
import React from 'react'
import { messages as m } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'
import { MedicinePrescriptionWrapper } from '../Medicine/wrapper/MedicinePrescriptionWrapper'
import { HealthPaths } from '../../lib/paths'

const MedicinePrescriptionHistory = () => {
  const { formatMessage } = useLocale()

  return (
    <MedicinePrescriptionWrapper
      pathname={HealthPaths.HealthMedicinePrescriptionHistory}
    >
      <Box></Box>
    </MedicinePrescriptionWrapper>
  )
}

export default MedicinePrescriptionHistory
