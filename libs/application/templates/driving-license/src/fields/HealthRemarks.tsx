import React, { FC } from 'react'

import {
  Box,
  Text,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  Application,
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { CurrentLicenseProviderResult } from '../dataProviders/CurrentLicenseProvider'

const HealthRemarks: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const remarks =
    getValueViaPath<CurrentLicenseProviderResult>(
      application.externalData,
      'currentLicense.data',
    )?.healthRemarks?.join(', ') || ''
  return (
    <Box>
      <AlertMessage
        type="warning"
        title={formatText(
          m.healthRemarksTitle,
          application,
          formatMessage,
        )}
        message={
          formatText(
            m.healthRemarksDescription,
            application,
            formatMessage,
          ) + " "+ remarks
        }
      />
    </Box>
  )
}

export default HealthRemarks
