import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { RegisteredProperties } from '../RegisteredProperties'
import { SearchProperties } from '../SearchProperties'
import { PropertyOverviewWithDetail, PropertyDetail } from '../../types/schema'

export const PropertiesManager: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { externalData } = application
  const { id } = field
  const { setValue } = useFormContext()

  const myProperties =
    (externalData.nationalRegistryRealEstate
      ?.data as PropertyOverviewWithDetail).properties || []

  //TODOx find better solution (need to get rid of __typename field to continue to next step)
  const getCleanValue: any = (p: PropertyDetail) => {
    return {
      propertyNumber: p?.propertyNumber,
      defaultAddress: {
        display: p?.defaultAddress?.display,
      },
      unitsOfUse: {
        unitsOfUse: [
          {
            marking: (p?.unitsOfUse?.unitsOfUse || [])[0]?.marking,
            displaySize: (p?.unitsOfUse?.unitsOfUse || [])[0]?.displaySize,
            buildYearDisplay: (p?.unitsOfUse?.unitsOfUse || [])[0]
              ?.buildYearDisplay,
            explanation: (p?.unitsOfUse?.unitsOfUse || [])[0]?.explanation,
          },
        ],
      },
    }
  }

  var selectedPropertyNumber = getValueViaPath(
    application.answers,
    'selectProperty.property.propertyNumber',
  ) as string

  return (
    <Controller
      name="selectProperty.property.propertyNumber"
      defaultValue={selectedPropertyNumber || myProperties[0]?.propertyNumber}
      render={({ value, onChange }) => {
        return (
          <>
            <RegisteredProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                setValue(id, {
                  property: getCleanValue(p),
                  isFromSearch: false,
                })
              }}
              selectedPropertyNumber={value}
            />
            <SearchProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                setValue(id, {
                  property: getCleanValue(p),
                  isFromSearch: true,
                })
              }}
              selectedPropertyNumber={value}
            />
          </>
        )
      }}
    />
  )
}
