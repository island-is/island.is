import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { PropertyTable } from './PropertyTable'
import { PropertyDetail } from '../../../types/schema'

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

  // remove this comment

  return (
    <PropertyTable
      application={application}
      field={field}
      myProperties={properties}
      selectHandler={selectHandler}
      selectedPropertyNumber={selectedPropertyNumber}
    />
  )
}
