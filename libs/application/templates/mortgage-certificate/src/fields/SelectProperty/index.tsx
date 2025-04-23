import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, ErrorMessage } from '@island.is/island-ui/core'
import { PropertyTypeSelectField } from './PropertyTypeSelectField'
import { useLocale } from '@island.is/localization'
import { PropertyTypes } from '../../lib/constants'
import { PropertyTypeSearchField } from './PropertyTypeSearchField'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { MortgageCertificate } from '../../lib/dataSchema'
import { CheckedProperties } from './CheckedProperties'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { error, application as applicationMessage } from '../../lib/messages'
import { SelectedProperty } from '../../shared'

export const SelectProperty: FC<
  React.PropsWithChildren<FieldBaseProps> & {
    field: { props: { allowVehicle: boolean; allowShip: boolean } }
  }
> = (props) => {
  const { application, field, errors, setBeforeSubmitCallback } = props
  const { control } = useFormContext<MortgageCertificate>()
  const { formatMessage } = useLocale()
  const messageValue = formatMessage(
    applicationMessage.values.maxPropertiesValue,
  )
  const maxProperties =
    messageValue.match(/^[0-9]+$/) != null ? parseInt(messageValue, 10) : 10
  const initialPropertyType = getValueViaPath(
    application.answers,
    `${field.id}.propertyType`,
  ) as PropertyTypes
  const [propertyType, setPropertyType] = useState<PropertyTypes | undefined>(
    initialPropertyType,
  )
  const { fields, append, remove } = useFieldArray({
    name: 'selectedProperties.properties',
    control,
  })

  const handleAddProperty = (property: SelectedProperty, index: number) => {
    if (index >= 0) {
      handleRemoveProperty(index)
    } else {
      append({
        propertyNumber: property.propertyNumber,
        propertyName: property.propertyName,
        propertyType: propertyType?.toString() ?? '',
      })
    }
  }

  const handleRemoveProperty = (index: number) => remove(index)

  setBeforeSubmitCallback?.(async () => {
    if (fields.length > maxProperties) {
      return [false, '']
    }
    return [true, null]
  })

  return (
    <>
      <PropertyTypeSelectField
        {...props}
        setPropertyType={setPropertyType}
        propertyType={propertyType}
      />
      <PropertyTypeSearchField
        {...props}
        propertyType={propertyType}
        checkedProperties={fields}
        setCheckedProperties={handleAddProperty}
      />
      {errors &&
        getErrorViaPath(errors, `${field.id}.properties`) &&
        fields.length === 0 && (
          <Box paddingTop={2} paddingBottom={2}>
            <ErrorMessage>
              {formatMessage(error.errorNoSelectedProperty)}
            </ErrorMessage>
          </Box>
        )}
      {!!fields.length && (
        <CheckedProperties
          {...props}
          properties={fields}
          handleRemoveProperty={handleRemoveProperty}
        />
      )}
      {fields.length > maxProperties && (
        <ErrorMessage>
          {formatMessage(error.errorToManyProperties, {
            value: maxProperties,
          })}
        </ErrorMessage>
      )}
    </>
  )
}
