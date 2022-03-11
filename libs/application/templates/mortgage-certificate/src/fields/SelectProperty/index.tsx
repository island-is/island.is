import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { PropertiesManager } from './PropertiesManager'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const SelectProperty: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)

  const { formatMessage } = useLocale()

  const validation = (externalData.validateMortgageCertificate?.data as {
    validation: {
      propertyNumber: string
      exists: boolean
      hasKMarking: boolean
    }
  })?.validation

  if (!showErrorMsg && validation?.propertyNumber && !validation?.exists) {
    setShowErrorMsg(true)
  }

  return (
    <>
      <PropertiesManager application={application} field={field} />
      {showErrorMsg && (
        <Box paddingTop={5} paddingBottom={5}>
          <AlertMessage
            type="error"
            title={formatMessage(m.errorSheriffApiTitle)}
            message={formatMessage(m.errorSheriffApiMessage)}
          />
        </Box>
      )}
    </>
  )
}
