import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { RegisteredProperties } from '../RegisteredProperties'
import { SearchProperties } from '../SearchProperties'
import { PropertyDetail, PropertyOverviewWithDetail } from '../../types/schema'

export const PropertiesManager: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { externalData } = application
  const properties =
    (externalData.nationalRegistryRealEstate
      ?.data as PropertyOverviewWithDetail).properties || []

  const [selectedProperty, setSelectedProperty] = useState<
    PropertyDetail | undefined
  >({
    ...properties[0],
  })

  const handleSelect = (property: PropertyDetail) => {
    setSelectedProperty(property)
  }

  return (
    <>
      <RegisteredProperties
        application={application}
        field={field}
        selectHandler={handleSelect}
        activePropertyNumber={selectedProperty?.propertyNumber}
      />
      <SearchProperties
        application={application}
        field={field}
        selectHandler={handleSelect}
        activePropertyNumber={selectedProperty?.propertyNumber}
      />
    </>
  )
}
