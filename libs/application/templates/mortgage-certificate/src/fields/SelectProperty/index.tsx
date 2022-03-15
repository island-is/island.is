import React, { FC, RefAttributes, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, AlertMessage, BoxProps } from '@island.is/island-ui/core'
import { PropertiesManager } from './PropertiesManager'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const SelectProperty: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData, answers } = application
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const [forceHideErrorMsg, setForceHideErrorMsg] = useState<boolean>(false)

  const { formatMessage } = useLocale()

  //TODOx, dont look at externalData
  const { validation } = externalData.validateMortgageCertificate?.data as {
    validation: {
      propertyNumber: string
      exists: boolean
      hasKMarking: boolean
    }
  }

  if (!showErrorMsg && validation?.propertyNumber && !validation?.exists) {
    setShowErrorMsg(true)
  }

  // const scrollTo = (ref: any) => {
  //   if (ref) {
  //     ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
  //   }
  // }

  return (
    <>
      <PropertiesManager
        application={application}
        field={field}
        onClearErrorMsg={() => {
          setForceHideErrorMsg(true)
        }}
      />
      {showErrorMsg && !forceHideErrorMsg ? (
        <Box /*ref={scrollTo}*/ paddingTop={5} paddingBottom={5}>
          <AlertMessage
            type="error"
            title={formatMessage(m.errorSheriffApiTitle)}
            message={formatMessage(m.errorSheriffApiMessage)}
          />
        </Box>
      ) : null}
    </>
  )
}
