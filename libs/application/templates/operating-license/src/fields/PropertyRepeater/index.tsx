import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ArrayField,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { Query, SearchForPropertyInput } from '@island.is/api/schema'
import { SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import { Property } from '../../lib/constants'
import * as styles from './PropertyRepeater.css'

export const PropertyRepeater: FC<FieldBaseProps> = ({ field }) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { fields, append, remove } = useFieldArray<Property>({
    name: `${id}`,
  })

  const handleAddProperty = () =>
    append({
      propertyNumber: '',
      address: '',
      spaceNumber: '',
      customerCount: '',
    })

  useEffect(() => {
    if (fields.length < 1) {
      handleAddProperty()
    }
  }, [])

  return (
    <Box>
      {fields.map((item, index) => (
        <PropertyItem
          field={item}
          fieldName={id}
          index={index}
          remove={remove}
          key={`${id}[${index}]`}
        />
      ))}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddProperty}
          size="medium"
        >
          {formatMessage(m.addProperty)}
        </Button>
      </Box>
    </Box>
  )
}

const PropertyItem = ({
  field,
  index,
  remove,
  fieldName,
  error,
}: {
  field: Partial<ArrayField<Property, 'id'>>
  fieldName: string
  index: number
  remove: (index: number) => void
  error?: any
}) => {
  const fieldIndex = `${fieldName}.${index}`
  const propertyNumberField = `${fieldIndex}.propertyNumber`
  const addressField = `${fieldIndex}.address`
  const spaceNumberField = `${fieldIndex}.spaceNumber`
  const customerCountField = `${fieldIndex}.customerCount`
  const propertyNumberInput = useWatch({
    name: propertyNumberField,
    defaultValue: '',
  })

  const address = useWatch({ name: addressField, defaultValue: '' })
  const { control, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const [
    getProperty,
    { loading: _queryLoading, error: _queryError },
  ] = useLazyQuery<Query, { input: SearchForPropertyInput }>(
    SEARCH_FOR_PROPERTY_QUERY,
    {
      onCompleted: (data) => {
        setValue(
          addressField,
          data.searchForProperty?.defaultAddress?.display ?? '',
        )
      },
    },
  )

  useEffect(() => {
    // According to Skra.is:
    // https://www.skra.is/um-okkur/frettir/frett/2018/03/01/Nytt-fasteignanumer-og-itarlegri-skraning-stadfanga/
    // The property number is a seven digit informationless sequence.
    // Has the prefix F.
    if (/F\d{7}$/.test(propertyNumberInput.trim().toUpperCase())) {
      getProperty({
        variables: {
          input: {
            propertyNumber: propertyNumberInput,
          },
        },
      })
    }
  }, [getProperty, address, addressField, propertyNumberInput, setValue])

  return (
    <Box position="relative" marginTop={2}>
      <Controller
        name={fieldIndex}
        control={control}
        render={() => <input type="hidden" />}
      />
      <Text variant="h5" as="h5" paddingBottom={2}>
        Rými {index + 1}
      </Text>
      {index !== 0 && (
        <Box
          position="absolute"
          className={styles.removeFieldButton}
          paddingBottom={2}
        >
          <Button
            variant="ghost"
            size="small"
            circle
            icon="remove"
            onClick={() => remove(index)}
          />
        </Box>
      )}
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={propertyNumberField}
            name={propertyNumberField}
            label={formatMessage(m.propertyNumber)}
            backgroundColor="blue"
            defaultValue={field.propertyNumber}
            error={error?.assetNumber ?? undefined}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={addressField}
            name={addressField}
            label={formatMessage(m.address)}
            readOnly
            defaultValue={field.address}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={spaceNumberField}
            name={spaceNumberField}
            label={formatMessage(m.spaceNumber)}
            backgroundColor="blue"
            format="#########"
            defaultValue={field.spaceNumber?.toString()}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={customerCountField}
            name={customerCountField}
            label={formatMessage(m.customerCount)}
            backgroundColor="blue"
            format="#########"
            defaultValue={field.customerCount?.toString()}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
