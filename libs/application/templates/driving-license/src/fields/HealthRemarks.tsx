import React, { FC, useEffect } from 'react'

import { Box, AlertMessage } from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { CurrentLicenseProviderResult } from '../dataProviders/CurrentLicenseProvider'
import { useFormContext } from 'react-hook-form'

const HealthRemarks: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const remarks: string[] =
    getValueViaPath<CurrentLicenseProviderResult>(
      application.externalData,
      'currentLicense.data',
    )?.healthRemarks || []

  const { setValue } = useFormContext()

  useEffect(() => {
    setValue('hasHealthRemarks', remarks?.length > 0 ? 'yes' : 'no')
  }, [remarks, setValue])

  return (
    <Box>
      <AlertMessage
        type="warning"
        title={formatText(m.healthRemarksTitle, application, formatMessage)}
        message={
          formatText(m.healthRemarksDescription, application, formatMessage) +
            ' ' +
            remarks?.join(', ') || ''
        }
      />
    </Box>
  )
}

export default HealthRemarks
