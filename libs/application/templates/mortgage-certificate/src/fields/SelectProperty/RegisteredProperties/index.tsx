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
  React.PropsWithChildren<FieldBaseProps & RegisteredPropertiesProps>
> = ({ application, field, selectHandler, selectedPropertyNumber }) => {
  const { externalData } = application

  const nationalRegistryRealEstateData = externalData.nationalRegistryRealEstate
    ?.data as {
    properties: [PropertyDetail]
  } | null
  const properties = nationalRegistryRealEstateData?.properties

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
