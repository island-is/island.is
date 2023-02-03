import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { PropertyTable } from './PropertyTable'
import { PropertyDetail } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'

interface RegisteredPropertiesProps {
  selectHandler: (property: PropertyDetail | undefined) => void
  selectedPropertyNumber: string | undefined
}

export const RegisteredProperties: FC<
  FieldBaseProps & RegisteredPropertiesProps
> = ({ application, field, selectHandler, selectedPropertyNumber }) => {
  const { externalData } = application

  const { properties } = externalData.nationalRegistryRealEstate?.data as {
    properties: [PropertyDetail]
  }

  const { formatMessage } = useLocale()

  return (
    <>
      {properties && properties.length > 0 ? (
        <PropertyTable
          application={application}
          field={field}
          myProperties={properties}
          selectHandler={selectHandler}
          selectedPropertyNumber={selectedPropertyNumber}
        />
      ) : (
        <Box marginTop={4}>
          <AlertMessage
            type="info"
            message={formatMessage(m.mortgageCertificateNoPropertyRegistered)}
          />
        </Box>
      )}
    </>
  )
}
