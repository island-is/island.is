import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { RegisteredProperties } from '../RegisteredProperties'
import { SearchProperties } from '../SearchProperties'

export interface RealEstateData {
  display: string
  displayShort: string
  locationNumber: number
  municipality: string
  postNumber: number
  propertyNumber: number
}

export interface RealEstate {
  defaultAddress: RealEstateData
  propertyNumber: string
}

export const PropertiesManager: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { externalData } = application
  const properties = externalData.nationalRegistryRealEstate.data.properties

  const [selectedProperty, setSelectedProperty] = useState<RealEstate>({
    ...properties[0],
  })

  const submitProperty = () => {
    console.log(selectedProperty)
  }

  const handleSelect = (property: RealEstate) => {
    console.log('Active property =', property.propertyNumber)
    setSelectedProperty(property)
  }

  return (
    <>
      <RegisteredProperties
        application={application}
        field={field}
        selectHandler={handleSelect}
        activePropertyNumber={selectedProperty.propertyNumber}
      />
      <SearchProperties
        application={application}
        field={field}
        selectHandler={handleSelect}
        activePropertyNumber={selectedProperty.propertyNumber}
      />
    </>
  )
}
