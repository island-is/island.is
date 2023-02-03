import React, { FC, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { RegisteredProperties } from '../RegisteredProperties'
import { SearchProperties } from '../SearchProperties'
import { PropertyDetail } from '@island.is/api/schema'

export const PropertiesManager: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { externalData } = application
  const { id } = field
  const { setValue } = useFormContext()

  const { properties } = externalData.nationalRegistryRealEstate?.data as {
    properties: [PropertyDetail]
  }

  let selectedPropertyNumber = getValueViaPath(
    application.answers,
    'selectProperty.propertyNumber',
  ) as string | undefined

  // check if hidden field has a selected property
  useEffect(() => {
    if (!selectedPropertyNumber) {
      const { validation } =
        (externalData.validateMortgageCertificate?.data as {
          validation: {
            propertyNumber: string
            isFromSearch: boolean
          }
        }) || {}

      if (validation?.propertyNumber) {
        selectedPropertyNumber = validation.propertyNumber
        setValue(id, {
          propertyNumber: validation.propertyNumber,
          isFromSearch: validation.isFromSearch,
        })
      }
    }
  }, [])

  const defaultProperty = properties ? properties[0] : undefined

  const onSelectProperty = (
    propertyNumber: string | undefined | null,
    isFromSearch: boolean,
  ) => {
    setValue(id, {
      propertyNumber: propertyNumber,
      isFromSearch: isFromSearch,
    })
  }

  return (
    <Controller
      name="selectProperty.propertyNumber"
      defaultValue={selectedPropertyNumber || defaultProperty?.propertyNumber}
      render={({ value, onChange }) => {
        return (
          <>
            <RegisteredProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                onSelectProperty(p?.propertyNumber, false)
              }}
              selectedPropertyNumber={value}
            />
            <SearchProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                onSelectProperty(p?.propertyNumber, true)
              }}
              selectedPropertyNumber={value}
            />
          </>
        )
      }}
    />
  )
}
