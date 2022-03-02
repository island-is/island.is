import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { PropertyTable } from '../PropertyTable'
import { PropertyDetail } from '../../../types/schema'

interface RegisteredPropertiesProps {
  selectHandler: (property: PropertyDetail | undefined) => void
  selectedPropertyNumber: string | undefined
}

export const RegisteredProperties: FC<
  FieldBaseProps & RegisteredPropertiesProps
> = ({ application, field, selectHandler, selectedPropertyNumber }) => {
  const { externalData } = application
  const myProperties =
    (externalData.nationalRegistryRealEstate?.data as {
      properties: [PropertyDetail]
    })?.properties || []

  return (
    <>
      {myProperties.map((p: PropertyDetail) => {
        return (
          <PropertyTable
            application={application}
            field={field}
            key={p.propertyNumber}
            selectHandler={selectHandler}
            propertyInfo={p}
            selectedPropertyNumber={selectedPropertyNumber}
          />
        )
      })}
    </>
  )
}
