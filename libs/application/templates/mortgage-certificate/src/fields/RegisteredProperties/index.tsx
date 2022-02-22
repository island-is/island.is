import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { PropertyTable } from '../PropertyTable'
import { PropertyOverviewWithDetail, PropertyDetail } from '../../types/schema'

interface RegisteredPropertiesProps {
  selectHandler: (property: PropertyDetail) => void
  activePropertyNumber: string | undefined | null
}

export const RegisteredProperties: FC<
  FieldBaseProps & RegisteredPropertiesProps
> = ({ application, selectHandler, activePropertyNumber }) => {
  const { externalData } = application
  const properties =
    (externalData.nationalRegistryRealEstate
      ?.data as PropertyOverviewWithDetail)?.properties || []

  return (
    <>
      {properties.map((p: PropertyDetail) => {
        return (
          <PropertyTable
            key={p.propertyNumber}
            selectHandler={selectHandler}
            activePropertyNumber={activePropertyNumber || ''}
            {...p}
          />
        )
      })}
    </>
  )
}
