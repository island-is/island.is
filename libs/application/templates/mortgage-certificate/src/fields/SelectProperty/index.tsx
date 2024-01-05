import React, { FC, useEffect, useState, useRef } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { PropertiesManager } from './PropertiesManager'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const SelectProperty: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { externalData } = application
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const { formatMessage } = useLocale()
  const errorMessage = useRef<HTMLDivElement>(null)

  const { validation } =
    (externalData.validateMortgageCertificate?.data as {
      validation: {
        propertyNumber: string
        exists: boolean
      }
    }) || {}

  // Display error message if certificate does not exists,
  // that is, an error occured calling Syslumenn api
  if (validation?.propertyNumber && !validation.exists && !showErrorMsg) {
    setShowErrorMsg(true)
  }

  useEffect(() => {
    setTimeout(() => {
      if (errorMessage && errorMessage.current) {
        errorMessage.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }, [showErrorMsg, errorMessage])

  return (
    <>
      <PropertiesManager application={application} field={field} />

      {showErrorMsg ? (
        <Box ref={errorMessage} paddingTop={5} paddingBottom={5}>
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
